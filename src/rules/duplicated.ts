import { BaseRule } from "./base";
import { ErrorCode } from "../assets/data/code";
import { ErrorMessage } from "../assets/data/message";

import { RuleKey, type RuleParam, type RuleResponse } from "../types";

class DuplicatedRule extends BaseRule {
  ruleKey = RuleKey.duplicated;

  test({ val, arg }: RuleParam): boolean {
    const prevValues = Array.isArray(arg) ? arg : [];

    return (
      !val ||
      prevValues.find(
        (v) => v.toLowerCase().trim() === val.toLowerCase().trim()
      ) === undefined
    );
  }

  res({ val, name }: RuleParam): RuleResponse {
    return {
      name,
      code: ErrorCode.duplicated,
      msg: this.message(ErrorMessage.duplicated, name, val || ""),
    };
  }
}

export default (new DuplicatedRule());
