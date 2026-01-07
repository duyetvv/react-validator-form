import { RuleKey } from "../types";
import RequiredRuleInst from "../rules/required";
import NumberRule from "../rules/number";
import EmailRule from "../rules/email";
import MaxLengthRule from "../rules/maxLength";
import MinLengthRule from "../rules/minLength";
import PhoneRule from "../rules/phone";
import DuplicatedRule from "../rules/duplicated";

export const RulesMapping = [
  { ruleName: RuleKey.required, inst: new RequiredRuleInst() },
  { ruleName: RuleKey.number, inst: new NumberRule() },
  { ruleName: RuleKey.maxLength, inst: new MaxLengthRule() },
  { ruleName: RuleKey.minLength, inst: new MinLengthRule() },
  { ruleName: RuleKey.email, inst: new EmailRule() },
  { ruleName: RuleKey.phone, inst: new PhoneRule() },
  { ruleName: RuleKey.duplicated, inst: new DuplicatedRule() },
];
