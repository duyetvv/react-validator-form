import { BaseRule } from "./base";
import { ErrorCode } from "../assets/data/code";
import { ErrorMessage } from "../assets/data/message";

import { RuleKey, type RuleParam, type RuleResponse } from "../types";

const emailReg = new RegExp(
  "^[a-zA-Z][a-zA-Z0-9_\\-\\.]{0,}@[a-zA-Z0-9\\-]{1,}(\\.[a-z0-9]{1,4}){1,3}$"
);

class EmailRule extends BaseRule {
  ruleKey = RuleKey.email;

  test({ val }: RuleParam): boolean {
    return !val || emailReg.test(val);
  }

  res({ name, arg }: RuleParam): RuleResponse {
    return {
      name,
      code: ErrorCode.email,
      msg: this.message(
        ErrorMessage.email,
        name,
        Array.isArray(arg) ? arg[0] : arg || ""
      ),
    };
  }
}

export default new EmailRule();
