/**
 * @fileoverview This file defines the types and interfaces related to validation rules.
 */

/**
 * Enum for the available rule keys.
 * This provides a centralized definition of all possible validation rule names.
 */
export enum RuleKey {
  required = "required",
  number = "number",
  email = "email",
  phone = "phone",
  minLength = "minLength",
  maxLength = "maxLength",
  maxNumber = "maxNumber",
  duplicated = "duplicated",
}

/**
 * Type representing the name of a validation rule.
 * It's a union of all possible `RuleKey` values.
 */
export type RuleName =
  | RuleKey.required
  | RuleKey.number
  | RuleKey.email
  | RuleKey.phone
  | RuleKey.minLength
  | RuleKey.maxLength
  | RuleKey.maxNumber
  | RuleKey.duplicated;

/**
 * Type for a collection of rules.
 * It's a key-value pair where the key is the rule name and the value is the rule argument.
 *
 * @example
 * const rules: Rules = {
 *   required: true,
 *   minLength: 8,
 * };
 */
export type Rules = {
  [key: string]: any;
};

/**
 * Type for the arguments that can be passed to a rule.
 * It can be a single string or an array of strings.
 */
export type ArgType = string | string[];

/**
 * Interface representing the parameters for a validation rule function.
 * This is the input for a validation function.
 */
export interface RuleParam {
  /** The value to be validated. */
  val: string;
  /** The name of the field being validated. */
  name: string;
  /** The arguments for the validation rule. */
  arg?: ArgType;
}

/**
 * Interface for the response of a validation rule.
 * This is part of the output of a validation function when validation fails.
 */
export interface RuleResponse {
  /** The name of the field that was validated. */
  name: string;
  /** The arguments that were used for the validation rule. */
  arg?: ArgType;
  /** A code representing the validation error. */
  code: string;
  /** The error message for the validation failure. */
  msg: string;
}

/**
 * Type for the result of a validation rule function.
 * This is the output of a validation function.
 */
export type RuleResult = {
  /** Whether the validation was successful. */
  isValid: boolean;
  /** The response of the validation rule, which is null if validation was successful. */
  res: RuleResponse | null;
};
