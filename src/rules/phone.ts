import { BaseRule } from "./base";
import { ErrorCode } from "../assets/data/code";
import { ErrorMessage } from "../assets/data/message";

import type { RuleParam, RuleResponse } from "../types/rules";

const phoneReg = new RegExp("^(0|84)(2|3|5|7|8|9)([0-9]{8})$");

class PhoneRule extends BaseRule {
  test({ val }: RuleParam): boolean {
    return !val || phoneReg.test(val);
  }

  res({ name, arg }: RuleParam): RuleResponse {
    return {
      name,
      code: ErrorCode.phone,
      msg: this.message(
        ErrorMessage.phone,
        name,
        Array.isArray(arg) ? arg[0] : arg || ""
      ),
    };
  }
}

export default PhoneRule;
