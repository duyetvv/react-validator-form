import { RuleKey } from "../types";

import type { BaseRule } from "../rules/base";
import requiredRule from "../rules/required";
import numberRule from "../rules/number";
import emailRule from "../rules/email";
import maxLengthRule from "../rules/maxLength";
import minLengthRule from "../rules/minLength";
import phoneRule from "../rules/phone";
import duplicatedRule from "../rules/duplicated";

const Rules: BaseRule[] = [
  requiredRule,
  numberRule,
  maxLengthRule,
  minLengthRule,
  emailRule,
  phoneRule,
  duplicatedRule,
];

class RegistryRules {
  private static rulesMap: Map<RuleKey, BaseRule> = new Map();

  static init() {
    Rules.forEach((rule) => {
      this.register(rule.ruleKey, rule);
    });

    return this;
  }

  static register(ruleKey: RuleKey, rule: BaseRule) {
    if (this.rulesMap.has(ruleKey)) {
      throw new Error(`Rule "${ruleKey}" already registered`);
    }
    this.rulesMap.set(ruleKey, rule);
  }

  static remove(ruleKey: RuleKey) {
    if (!this.rulesMap.has(ruleKey)) {
      throw new Error(`Rule "${ruleKey}" is not registered`);
    }

    this.rulesMap.delete(ruleKey);
  }

  static destroy() {
    this.rulesMap.clear();
  }

  static rules(): Map<RuleKey, BaseRule> {
    return this.rulesMap;
  }

  static get(ruleKey: RuleKey): BaseRule | null {
    if (!this.rulesMap.has(ruleKey)) {
      throw new Error(`Rule "${ruleKey}" is not registered`);
    } else {
      return this.rulesMap.get(ruleKey) || null;
    }
  }
}

export default RegistryRules.init();
