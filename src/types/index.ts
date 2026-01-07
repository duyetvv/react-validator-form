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
 * It's a key-value pair where the key is the rule name 
 * and the value is the rule argument.
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
export type RuleParam = {
  val: string;
  name: string;
  arg?: ArgType;
};

/**
 * Interface for the response of a validation rule.
 * This is part of the output of a validation function when validation fails.
 */
export type RuleResponse = {
  name: string;
  arg?: ArgType;
  code: string;
  msg: string;
};

export type FieldState = {
  name: string;
  isValid?: boolean;
};

export type FieldResult = {
  isValid: boolean;
  res: RuleResponse[] | null;
};

export const defState = true;
