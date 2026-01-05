import { BaseRule } from "./base";
import { ErrorCode } from "../assets/data/code";
import { ErrorMessage } from "../assets/data/message";

import type { RuleParam, RuleResponse } from "../types/rules";

class DuplicatedRule extends BaseRule {
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

export default DuplicatedRule;
