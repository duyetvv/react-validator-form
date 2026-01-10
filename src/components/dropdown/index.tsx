import { useCallback, useEffect, useMemo, useState } from "react";

import Validator from "../../validator";
import type { Rules } from "../../types";
import type { ValidatorStore } from "../../validator/store";

import "./styles.scss";

export interface DropdownProps<T> {
  name: string;
  source: T[];
  defSelected: T;
  valueKey: keyof T;
  labelKey: keyof T;
  rules?: Rules;
  store?: ValidatorStore;
  hiddenInput?: boolean;
  onChange: (value: string, item: T) => void;
}

export interface FormattedItem {
  label?: string;
  value?: string;
}

export const formatItem = (
  item: any,
  labelKey: string,
  valueKey: string
): FormattedItem => {
  if (item) {
    return { label: String(item[labelKey]), value: String(item[valueKey]) };
  }

  return {};
};

function Dropdown<T>({
  name,
  source,
  defSelected,
  valueKey,
  labelKey,
  store,
  rules = {},
  hiddenInput = true,
  onChange,
}: DropdownProps<T>) {
  const [errors, setErrors] = useState<Record<string, string>[]>();
  const [selected, setSelected] = useState<FormattedItem | null>(null);
  const [toggled, setToggled] = useState<boolean>(false);
  const validator = useMemo(() => Validator.initStore(store), []);

  useEffect(() => {
    if (source) {
      const currItem = defSelected || source[0];
      setSelected(formatItem(currItem));
      onChange(name, currItem);
    }
  }, [source]);

  const validateInput = useCallback((value: string): boolean => {
    const result = validator.run(rules, name, value);

    setErrors(
      result.res?.map((ele) => ({
        code: ele.code || "",
        message: ele.msg || "",
      }))
    );

    return result.isValid;
  }, []);

  const formatItem = useCallback((item: T | null): FormattedItem | null => {
    if (item) {
      return { label: String(item[labelKey]), value: String(item[valueKey]) };
    }

    return null;
  }, []);

  const onToggle = useCallback(() => {
    setToggled((prevToggle) => !prevToggle);
  }, []);

  const onSelectItem = useCallback((item: T) => {
    const currItem = formatItem(item);

    setSelected(currItem);
    setToggled(false);

    validateInput(currItem?.value || "");

    onChange(name, item);
  }, []);

  return (
    <div className={`dropdown ${toggled ? "toggled" : ""}`}>
      <span
        className="dropdown-toggle"
        role="representation"
        onClick={onToggle}
      >
        <span className="dropdown-toggle-label">{selected?.label}</span>
        <span className="dropdown-toggle-icon"></span>
      </span>

      {hiddenInput ? (
        <input type="hidden" name={name} value={selected?.value || ""} />
      ) : (
        ""
      )}

      {errors && errors.length
        ? errors.map((err) => (
            <span key={err["code"]} className="textbox__error">
              {err["message"]}
            </span>
          ))
        : ""}

      {toggled && source && source.length ? (
        <div className="dropdown-menu">
          {source.map((item: T) => {
            const currItem = formatItem(item);
            return (
              <span
                key={currItem?.value}
                className={`dropdown-menu-item ${
                  currItem?.value === selected?.value ? "selected" : ""
                }`}
                role="representation"
                onClick={() => onSelectItem(item)}
              >
                {currItem?.label}
              </span>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Dropdown;
