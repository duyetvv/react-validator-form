import {
  type ValidationResult,
  type ValidationSnapshot,
  type ValidationField,
  defIsValid,
} from "../types/validation";

type Listener = () => void;

/**
 * Creates a new validator store for a form.
 * Each form should have its own validator store.
 * @param formName The name of the form.
 * @returns A form validator store.
 */
export function createValidatorStore(formName: string) {
  const fieldStates = new Map<string, ValidationResult | null>();
  const listeners = new Set<Listener>();

  let cachedSnapshot: ValidationSnapshot | null = null;

  /**
   * Notifies all listeners that the store has changed.
   * This function is called whenever the store is updated.
   * It clears the cached snapshot and calls all listeners.
   */
  function notify() {
    cachedSnapshot = null;
    listeners.forEach((l) => l());
  }

  /**
   * Gets a snapshot of the current validation state.
   * The snapshot is cached to avoid recomputing it on every call.
   * @returns A snapshot of the current validation state.
   */
  function getSnapshot() {
    console.log("getSnapshot fieldStates", fieldStates);

    if (cachedSnapshot) {
      return cachedSnapshot;
    }

    let isValid = true;

    fieldStates.forEach((field) => {
      if (!field?.isValid) {
        isValid = false;
      }
    });

    cachedSnapshot = { formName, isValid };

    return cachedSnapshot;
  }

  /**
   * Registers a new field in the store.
   * If the field is already registered, this function does nothing.
   * @param name The name of the field.
   * @param isValid The initial validation state of the field.
   */
  function registerField(name: string, isValid: boolean = defIsValid) {
    if (fieldStates.has(name)) return;

    fieldStates.set(name, {
      isValid: isValid,
      res: null,
    });
  }

  return {
    /**
     * Registers one or more fields in the store.
     * @param fields An array of field names or an array of objects with a name and an optional isValid property.
     */
    registerFields(fields: ValidationField[] | string[]) {
      fields.forEach((field) => {
        if (typeof field === "string") {
          registerField(field);
        } else {
          registerField(field.name, field.isValid);
        }
      });

      notify();
    },

    /**
     * Updates the validation result of a field.
     * @param name The name of the field.
     * @param result The new validation result.
     * @throws An error if the field is not registered.
     */
    updateField(name: string, result: ValidationResult) {
      if (!fieldStates.has(name)) {
        throw new Error(`Unregistered field: ${name}`);
      }

      fieldStates.set(name, result);
      notify();
    },

    /**
     * Subscribes to changes in the store.
     * @param listener The listener to subscribe.
     * @returns A function to unsubscribe the listener.
     */
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /**
     * Gets a snapshot of the current validation state.
     * @returns A snapshot of the current validation state.
     */
    getSnapshot() {
      return getSnapshot();
    },

    /**
     * Unsubscribes all listeners and clears all field states.
     * This is useful when the form is unmounted.
     */
    unsubscribe() {
      listeners.clear();
      fieldStates.clear();
    },
  };
}

export type ValidatorStore = ReturnType<typeof createValidatorStore>;
