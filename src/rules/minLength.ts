import { BaseRule } from "./base";
import { ErrorCode } from "../assets/data/code";
import { ErrorMessage } from "../assets/data/message";

import { RuleKey, type RuleParam, type RuleResponse } from "../types";

class MinLengthRule extends BaseRule {
  ruleKey = RuleKey.minLength;

  test({ val, arg }: RuleParam): boolean {
    return (
      !!arg &&
      (!val || val?.length >= parseInt(Array.isArray(arg) ? arg[0] : arg, 10))
    );
  }

  res({ name, arg }: RuleParam): RuleResponse {
    return {
      name,
      code: ErrorCode.minLength,
      msg: this.message(
        ErrorMessage.minLength,
        name,
        Array.isArray(arg) ? arg[0] : arg || ""
      ),
    };
  }
}

export default new MinLengthRule();
