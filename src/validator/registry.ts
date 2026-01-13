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

/**
 * The `RegistryRules` class provides a central registry for managing validation rules.
 * It allows for the registration, removal, and retrieval of rules, and is exported
 * as a pre-initialized singleton, making it readily available throughout the application.
 */
class RegistryRules {
  private static rulesMap: Map<RuleKey, BaseRule> = new Map();

  /**
   * Initializes the rule registry by registering a predefined set of rules.
   * This method is called automatically when the module is loaded.
   * @returns {this} The `RegistryRules` class itself, to allow for chaining.
   */
  static init() {
    Rules.forEach((rule) => {
      this.register(rule.ruleKey, rule);
    });

    return this;
  }

  /**
   * Registers a new validation rule.
   * @param {RuleKey} ruleKey - The unique key for the rule.
   * @param {BaseRule} rule - The rule object to register.
   * @throws {Error} If a rule with the same key is already registered.
   */
  static register(ruleKey: RuleKey, rule: BaseRule) {
    if (this.rulesMap.has(ruleKey)) {
      throw new Error(`Rule "${ruleKey}" already registered`);
    }
    this.rulesMap.set(ruleKey, rule);
  }

  /**
   * Removes a registered validation rule.
   * @param {RuleKey} ruleKey - The key of the rule to remove.
   * @throws {Error} If the rule is not found in the registry.
   */
  static remove(ruleKey: RuleKey) {
    if (!this.rulesMap.has(ruleKey)) {
      throw new Error(`Rule "${ruleKey}" is not registered`);
    }

    this.rulesMap.delete(ruleKey);
  }

  /**
   * Clears all registered rules from the registry.
   */
  static destroy() {
    this.rulesMap.clear();
  }

  /**
   * Retrieves the map of all registered rules.
   * @returns {Map<RuleKey, BaseRule>} The map of rules.
   */
  static rules(): Map<RuleKey, BaseRule> {
    return this.rulesMap;
  }

  /**
   * Retrieves a specific validation rule by its key.
   * @param {RuleKey} ruleKey - The key of the rule to retrieve.
   * @returns {BaseRule | null} The rule object, or null if not found.
   * @throws {Error} If the rule is not registered.
   */
  static get(ruleKey: RuleKey): BaseRule | null {
    if (!this.rulesMap.has(ruleKey)) {
      throw new Error(`Rule "${ruleKey}" is not registered`);
    } else {
      return this.rulesMap.get(ruleKey) || null;
    }
  }
}

export default RegistryRules.init();
