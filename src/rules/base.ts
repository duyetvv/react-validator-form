import type { RuleKey, RuleParam, RuleResponse } from "../types";

export abstract class BaseRule {
  abstract ruleKey: RuleKey;

  abstract test(params: RuleParam): boolean;
  abstract res(params: RuleParam): RuleResponse;

  message(orgMsg: string, fieldName: string, arg: string): string {
    return orgMsg.replace("{#fieldName}", fieldName).replace("{#arg}", arg);
  }
}
