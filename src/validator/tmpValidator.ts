import type { BaseRule } from "../rules/base";

import { RulesMapping } from "./mapping";
import { type Rules } from "../types/rules";
import type { ValidationResult } from "../types/validation";

/**
 * @class Validator
 * @description A static class to manage validation rules and perform validation.
 * It is initialized with a set of default rules and can be extended with custom rules.
 * It can also be connected to a store to keep track of the validation state of a form.
 */
class Validator {
  /**
   * A map to store the registered validation rules.
   * @private
   * @static
   */
  private static rules = new Map<string, BaseRule>();


  /**
   * Initializes the validator by registering the rules from RulesMapping.
   * This method should be called before any other method of the class.
   * @static
   * @returns The Validator class for chaining.
   */
  static init() {
    RulesMapping.forEach((rule) => {
      this.add(rule.ruleName, rule.inst);
    });
    return this;
  }

  /**
   * Adds a new validation rule to the validator.
   * @static
   * @param ruleName - The name of the rule.
   * @param ruleInst - The rule instance, which should be a class that extends BaseRule.
   */
  static add(ruleName: string, ruleInst: BaseRule): void {
    this.rules.set(ruleName, ruleInst);
  }

  /**
   * Gets a validation rule by name.
   * @static
   * @param ruleName - The name of the rule.
   * @returns The rule instance.
   * @throws An error if the rule is not registered.
   */
  static get(ruleName: string): BaseRule {
    const rule = this.rules.get(ruleName);
    if (!rule) {
      throw new Error(`Rule "${ruleName}" is not registered`);
    }
    return rule;
  }

  /**
   * Validates a value against a set of rules.
   * @static
   * @param rules - The rules to validate against.
   * @param fieldName - The name of the field being validated.
   * @param val - The value to validate.
   * @returns An array of validation results for each rule.
   */
  static validate(
    rules: Rules,
    fieldName: string,
    val: string
  ): ValidationResult[] {
    const rulekeys = Object.keys(rules);

    if (!rulekeys.length) {
      return [{ isValid: true, res: null }];
    }

    return rulekeys.map((ruleKey) => {
      const rule = this.get(ruleKey);
      const arg = rules[ruleKey];

      return {
        isValid: rule.test({ val, name: fieldName, arg }),
        res: rule.res({ val, name: fieldName, arg }),
      };
    });
  }

  /**
   * Destroys the validator by clearing all registered rules.
   * This is useful for cleanup, especially in testing environments.
   * @static
   */
  static destroy() {
    this.rules.clear();
  }
}

// export the instance of Validator af
export default Validator.init();

