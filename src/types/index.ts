export type FieldState<T = any> = {
  value: T;
  errors: string[];
  touched: boolean;
};


export interface FieldProps<T> {
  type: string;
  name: string;
  genericName?: string;
  label?: string;
  defaultValue?: T;
  placeholder?: string;
  // rules?: Rules;
  onChange?: (value: T) => void;
  disabled?: boolean;
}
