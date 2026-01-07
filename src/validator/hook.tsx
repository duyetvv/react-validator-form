import { useSyncExternalStore } from "react";
import { type ValidatorStore } from "./store";

export function useFormState(store: ValidatorStore) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
