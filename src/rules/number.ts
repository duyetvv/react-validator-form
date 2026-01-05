import { BaseRule } from "./base";
import { ErrorCode } from "../assets/data/code";
import { ErrorMessage } from "../assets/data/message";

import type { RuleParam, RuleResponse } from "../types/rules";

class NumberRule extends BaseRule {
  test({ val }: RuleParam): boolean {
    return !val || !isNaN(Number(val?.trim()));
  }

  res({ name }: RuleParam): RuleResponse {
    return {
      name,
      code: ErrorCode.number,
      msg: this.message(ErrorMessage.number, name, ""),
    };
  }
}

export default NumberRule;
