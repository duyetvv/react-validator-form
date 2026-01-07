import {
  type FieldResult,
  type FieldState,
  defState,
} from "../types";

type Listener = () => void;

/**
 * Creates a new validator store for a form.
 * Each form should have its own validator store.
 * @param formName The name of the form.
 * @returns A form validator store.
 */
export function createValidatorStore() {
  const listeners: Set<Listener> = new Set();
  const fieldsMap: Map<string, FieldResult> = new Map();

  /**
   * Notifies all listeners that the store has changed.
   * This function is called whenever the store is updated.
   * It clears the cached snapshot and calls all listeners.
   */
  function notify() {
    listeners.forEach((l) => l());
  }

  /**
   * Registers a new field in the store.
   * If the field is already registered, this function does nothing.
   * @param name The name of the field.
   * @param isValid The initial validation state of the field.
   */
  function registerField(name: string, isValid: boolean = defState) {
    if (fieldsMap.has(name)) return;
    fieldsMap.set(name, { isValid, res: null });
  }

  return {
    /**
     * Registers one or more fields in the store.
     * @param registeredfields An array of field names
     * or an array of objects with a name and an optional isValid property.
     */
    registerFields(registeredfields: string[] | FieldState[]) {
      registeredfields.forEach((field) => {
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
    updateField(name: string, fieldState: FieldResult) {
      fieldsMap.set(name, fieldState);
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
      let isValid = true;

      fieldsMap.forEach((fieldRes) => {
        if (!fieldRes.isValid) {
          isValid = false;
        }
      });

      return isValid;
    },

    /**
     * Unsubscribes all listeners and clears all field states.
     * This is useful when the form is unmounted.
     */
    unsubscribe() {
      listeners.clear();
      fieldsMap.clear();
    },
  };
}

export type ValidatorStore = ReturnType<typeof createValidatorStore>;
