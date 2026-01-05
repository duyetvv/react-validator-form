import type { RuleResponse } from "./rules";

export const defIsValid = true;

export type ValidationResult = {
  isValid: boolean;
  res: RuleResponse | null;
};

export type ValidationSnapshot = {
  formName: string;
  isValid: boolean;
};

