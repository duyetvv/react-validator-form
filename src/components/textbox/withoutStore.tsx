import {
  type ChangeEvent,
  type FocusEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { RuleKey, type Rules } from "../../types/rules";
import Validator from "../../validator/tmpValidator";

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
  onChangeText?: (evt: InteractEvent) => void;
  onBlurText?: (evt: InteractEvent) => void;
  [key: string]: any;
}

function TextBox({
  type,
  name,
  defVal = "",
  label,
  placeholder,
  rules = {},
  onChangeText,
  onBlurText,
  genericName,
  ...rest
}: TextBoxProps) {
  const [errors, setErrors] = useState<Record<string, string>[]>();

  const validateInput = useCallback(
    (
      value: string
    ): { isValid: boolean; errMsgs: Record<string, string>[] } => {
      const result = Validator.validate(rules, genericName || name, value);

      const errsMsg = result.reduce<Record<string, string>[]>(
        (accumulator, ele) => {
          if (!ele.isValid) {
            accumulator.push({
              code: ele.res?.code || "",
              message: ele.res?.msg || "",
            });
          }

          return accumulator;
        },
        []
      );

      return { isValid: errsMsg.length === 0, errMsgs: errsMsg };
    },
    []
  );

  useEffect(() => {
    if (rules) {
      const { isValid } = validateInput(defVal);

      if (typeof onChangeText === "function") {
        onChangeText({ name, value: defVal, isValid });
      }

      if (typeof onBlurText === "function") {
        onBlurText({ name, value: defVal, isValid });
      }
    }
  }, [validateInput]);

  const onBlurInput = useCallback((evt: FocusEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    const { isValid, errMsgs } = validateInput(value);

    setErrors(errMsgs);

    if (typeof onBlurText === "function") {
      onBlurText({ name, value, isValid });
    }
  }, []);

  const onChangeInput = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    const { isValid, errMsgs } = validateInput(value);

    setErrors(errMsgs);

    if (typeof onChangeText === "function") {
      onChangeText({ name, value, isValid });
    }
  };

  return (
    <fieldset className="textbox--wrapper">
      <label
        htmlFor={`${name}_textbox`}
        className={`textbox__label ${
          rules[RuleKey.required] ? "required" : ""
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
