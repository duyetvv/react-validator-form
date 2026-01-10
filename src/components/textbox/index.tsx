import {
  type ChangeEvent,
  type FocusEvent,
  useCallback,
  useMemo,
  useState,
} from "react";

import { type Rules, RuleKey } from "../../types";
import type { ValidatorStore } from "../../validator/store";
import Validator from "../../validator";

import "./styles.scss";

export type InteractEvent = {
  name: string;
  value: string;
  isValid?: boolean;
};

export interface TextBoxProps {
  type: string;
  name: string;
  label?: string;
  defVal?: string;
  placeholder?: string;
  genericName?: string;
  rules?: Rules;
  store?: ValidatorStore;
  onChangeText?: (evt: InteractEvent) => void;
  onBlurText?: (evt: InteractEvent) => void;
  [key: string]: any;
}

function TextBox({
  type,
  name,
  defVal,
  label,
  placeholder,
  rules,
  onChangeText,
  onBlurText,
  genericName,
  store,
  ...rest
}: TextBoxProps) {
  const [errors, setErrors] = useState<Record<string, string>[]>();
  const validator = useMemo(() => Validator.initStore(store), []);

  const validateInput = useCallback((value: string): boolean => {
    if (!rules) return true;

    const result = validator.run(rules, genericName || name, value);

    setErrors(
      result.res?.map((ele) => ({
        code: ele.code || "",
        message: ele.msg || "",
      }))
    );

    return result.isValid;
  }, []);

  const onBlurInput = useCallback((evt: FocusEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    validateInput(value);

    if (typeof onBlurText === "function") {
      onBlurText({ name, value });
    }
  }, []);

  const onChangeInput = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    validateInput(value);

    if (typeof onChangeText === "function") {
      onChangeText({ name, value });
    }
  };

  return (
    <fieldset className="textbox--wrapper">
      <label
        htmlFor={`${name}_textbox`}
        className={`textbox__label ${
          rules && rules[RuleKey.required] ? "required" : ""
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={`${name}_textbox`}
        placeholder={placeholder}
        defaultValue={defVal}
        className={`textbox ${errors && errors.length ? "error" : ""}`}
        onBlur={onBlurInput}
        onChange={onChangeInput}
        {...rest}
      />
      {errors && errors.length
        ? errors.map((err) => (
            <span key={err["code"]} className="textbox__error">
              {err["message"]}
            </span>
          ))
        : ""}
    </fieldset>
  );
}

export default TextBox;
