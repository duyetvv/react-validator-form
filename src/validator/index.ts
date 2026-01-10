import type { FieldResult, Rules, RuleKey } from "../types";
import { type ValidatorStore } from "./store";
import registryRules from "./registry";

/**
 * @class Validator connected to a store to keep track of the validation state of a form.
 */
class Validator {
  /**
   * The validator store instance.
   * @private
   * @static
   */
  private static store: ValidatorStore | null = null;
  /**
   * Initializes the validator store.
   * The store is used to keep track of the validation state of the form fields.
   * @static
   * @param storeInstance - An optional validator store instance.
   * @returns The Validator class for chaining.
   */
  static bindStore(storeInstance?: ValidatorStore) {
    this.store = storeInstance || null;
    return this;
  }
  /**
   * Validates a value against a set of rules.
   * @static
   * @param rules - The rules to validate against.
   * @param fieldName - The name of the field being validated.
   * @param val - The value to validate.
   * @returns An array of validation results for each rule.
   */
  static run(rules: Rules, fieldName: string, val: string): FieldResult {
    const rulekeys = Object.keys(rules);

    if (!rulekeys.length) {
      return { isValid: true, res: null };
    }

    const validatedRules = rulekeys.map((key) => {
      const ruleKey = key as RuleKey;
      const arg = rules[ruleKey];

      const rule = registryRules.get(ruleKey);

      if (!rule) {
        throw new Error(`Rule "${key}" is not registered`);
      }

      return {
        isValid: rule.test({ val, name: fieldName, arg }),
        res: rule.res({ val, name: fieldName, arg }),
      };
    });

    const invalidRules = validatedRules.filter((r) => !r.isValid);
    const fieldResult = {
      isValid: invalidRules.length === 0,
      res: invalidRules.map((r) => r.res) || null,
    };

    if (this.store) {
      this.store.updateField(fieldName, fieldResult);
    }

    return fieldResult;
  }

  /**
   * Destroys the validator by clearing all registered rules.
   * This is useful for cleanup, especially in testing environments.
   * @static
   */
  static destroy() {
    registryRules.destroy();
  }
}

export default Validator;
