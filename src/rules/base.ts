import type { RuleParam, RuleResponse } from "../types/rules";

export abstract class BaseRule {
  abstract test(params: RuleParam): boolean;
  abstract res(params: RuleParam): RuleResponse;

  message(orgMsg: string, fieldName: string, arg: string): string {
    return orgMsg.replace("{#fieldName}", fieldName).replace("{#arg}", arg);
  }
}
