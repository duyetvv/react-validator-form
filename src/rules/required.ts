import { BaseRule } from "./base";
import { ErrorCode } from "../assets/data/code";
import { ErrorMessage } from "../assets/data/message";

import type { RuleParam, RuleResponse } from "../types";

class RequiredRule extends BaseRule {
  test({ val }: RuleParam): boolean {
    return !!val && val.length > 0;
  }

  res({ name, arg }: RuleParam): RuleResponse {
    // const that = this;
    return {
      name,
      code: ErrorCode.required,
      msg: this.message(
        ErrorMessage.required,
        name,
        Array.isArray(arg) ? arg[0] : arg || ""
      ),
    };
  }
}

export default RequiredRule;
