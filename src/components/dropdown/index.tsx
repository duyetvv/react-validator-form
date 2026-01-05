import { useCallback, useEffect, useMemo, useState } from "react";

import type { Rules } from "../../types/rules";
import Validator, { type ValidatorStore } from "../../validator";

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
  const [selected, setSelected] = useState<FormattedItem | null>(null);
  const [toggled, setToggled] = useState<boolean>(false);
  const validation = useMemo(() => Validator.initStore(store), []);

  useEffect(() => {
    if (source) {
      const currItem = defSelected || source[0];
      setSelected(formatItem(currItem));
      onChange(name, currItem);
    }
  }, [source]);

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

    const result = validation.validate(rules, name, currItem?.value || "");

    store &&
      store.updateField(name, {
        isValid: result.length === 0,
        res: {
          name: name,
          arg: result[0].res?.arg || "",
          code: result[0].res?.code || "",
          msg: result[0].res?.msg || "",
        },
      });

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
