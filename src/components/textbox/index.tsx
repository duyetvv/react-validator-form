import { type FocusEvent, useMemo, useState } from "react";
import { RuleKey, type Rules } from "../../types/rules";
import Validator, { type ValidatorStore } from "../../validator";

import "./styles.scss";

export type TextChangeEvent = {
  name: string;
  value: string;
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
  onChangeText?: (evt: TextChangeEvent) => void;
  [key: string]: any;
}

function TextBox({
  type,
  name,
  defVal,
  label,
  placeholder,
  rules = {},
  onChangeText,
  genericName,
  store,
  ...rest
}: TextBoxProps) {
  const [errors, setErrors] = useState<Record<string, string>[]>();
  const validation = useMemo(() => Validator.initStore(store), []);

  const onBlurInput = (evt: FocusEvent<HTMLInputElement>) => {
    const { value } = evt.target;

    const result = validation.validate(rules, genericName || name, value);

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

    setErrors(errsMsg);

    if (typeof onChangeText === "function") {
      onChangeText({ name, value });
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
