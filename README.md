# React Validation Template

Build your own React Validation Form

## Description

Sometimes, you need to build the special validator for the paticular purpose. But It's hard to custom the existing libraries in the market. You need to build yourself library, So here is one of the template you able to references.

## Idea

You have the input with the validation rules. And you want to split the validators individually, The Validator won't be intersected to each others.

```ts
export abstract class BaseRule {
  abstract test(params: RuleParam): boolean;
  abstract res(params: RuleParam): RuleResponse;

  message(orgMsg: string, fieldName: string, arg: string): string {
    return orgMsg.replace("{#fieldName}", fieldName).replace("{#arg}", arg);
  }
}
```

The Input should validate itself, and care its own validated status and it's error UI.

```tsx
const validateInput = useCallback((value: string): boolean => {
  const result = validator.run(rules, name, value);

  setErrors(
    result.res?.map((ele) => ({
      code: ele.code || "",
      message: ele.msg || "",
    }))
  );

  return result.isValid;
}, []);

...

<fieldset className="textbox--wrapper">
  // Input field
  {errors && errors.length
        ? errors.map((err) => (
            <span key={err["code"]} className="textbox__error">
              {err["message"]}
            </span>
          ))
        : ""}
</fieldset>
```

The form just get the state from the store to handle logic.

```ts
const formState = useSyncExternalStore(store.subscribe, store.getSnapshot);

const submit = () => {
  const message = formState ? "Form is valid" : "Form is not valid";
  window.alert(message);
};
```

## Implementation

### Preposition

- Defined the necessary types inside file `src/types`

```ts
export enum RuleKey {
  required = "required",
  phone = "phone",
}

export type RuleName = RuleKey.required | RuleKey.phone;

export type Rules = {
  [key: string]: any;
};

export type ArgType = string | string[];

export type RuleParam = {
  val: string;
  name: string;
  arg?: ArgType;
};

export type RuleResponse = {
  name: string;
  arg?: ArgType;
  code: string;
  msg: string;
};

export type FieldState = {
  name: string;
  isValid?: boolean;
};

export type FieldResult = {
  isValid: boolean;
  res: RuleResponse[] | null;
};

export const defState = true;
```

- Create the ErrorCode `assets/data/code.ts` you also can create yoruself by multiple languages or just hardcode it.

```ts
/** This ErrorCode also able to mapping to API response */
export const ErrorCode = {
  required: "api_error_required",
  phone: "api_error_phone",
};
```

- Create the ErrorMessage `assets/data/message.ts` you also can create yoruself by multiple languages or just hardcode it.

```ts
/**This for showing error from Realtime validation */
export const ErrorMessage = {
  required: "{#fieldName} is required",
  phone: "{#fieldName} must be a valid phone number",
};
```

### Step 1: Prepare validation validation rules

#### 1.1 Create the base class for Validator Rule.[Full code](https://github.com/duyetvv/react-validator-form/blob/main/src/rules/base.ts)

    ```ts
    export abstract class BaseRule {
      abstract test(params: RuleParam): boolean;
      abstract res(params: RuleParam): RuleResponse;

      message(orgMsg: string, fieldName: string, arg: string): string {
        return orgMsg.replace("{#fieldName}", fieldName).replace("{#arg}", arg);
      }
      // You can also build your message function for yourself
    }
    ```

#### 1.2 Create the specific validator rule. EX: [Required Rule](https://github.com/duyetvv/react-validator-form/blob/main/src/rules/required.ts)

    ```ts
    class RequiredRule extends BaseRule {
      test({ val }: RuleParam): boolean {
        return !!val && val.length > 0;
      }

      res({ name, arg }: RuleParam): RuleResponse {
        return {
          name,
          code: ErrorCode.required,
          msg: this.message(
            ErrorMessage.required,
            name,
            Array.isArray(arg) ? arg[0] : arg || ""
          ),
        };
      }
    }

    export default RequiredRule;
    ```

### Step 2: Create the validator

#### 2.1 Create the RulesMapping factory [code](https://github.com/duyetvv/react-validator-form/blob/main/src/validator/mapping.ts)

```ts
export const RulesMapping = [
  { ruleName: RuleKey.required, inst: new RequiredRuleInst() },
  { ruleName: RuleKey.phone, inst: new PhoneRule() },
  // ... Other Rules
];
```

#### 2.2 Create the Validator class at link with the run function at: [code](https://github.com/duyetvv/react-validator-form/blob/main/src/validator/index.ts)

```ts
class Validator {
  private static rules = new Map<string, BaseRule>();
  // ...
  static run(rules: Rules, fieldName: string, val: string): FieldResult {
    const rulekeys = Object.keys(rules);

    if (!rulekeys.length) {
      return { isValid: true, res: null };
    }

    const result = rulekeys.map((ruleKey) => {
      const rule = this.get(ruleKey);
      const arg = rules[ruleKey];

      return {
        isValid: rule.test({ val, name: fieldName, arg }),
        res: rule.res({ val, name: fieldName, arg }),
      };
    });

    const invalidRules = result.filter((r) => !r.isValid);
    const isValid = invalidRules.length === 0;
    const inValidRes = invalidRules.map((r) => r.res);

    return {
      isValid,
      res: inValidRes || null,
    };
  }
  // ...
}
```

### Step 3: Use the validator in your Input, EX: [textbox](https://github.com/duyetvv/react-validator-form/blob/main/src/components/textbox/index.tsx)

- validate the input on blur/change event.

  ```tsx
  const validateInput = useCallback((value: string): boolean => {
    const result = validator.run(rules, genericName || name, value);

    setErrors(
      result.res?.map((ele) => ({
        code: ele.code || "",
        message: ele.msg || "",
      }))
    );

    return result.isValid;
  }, []);

  const onBlurInput = useCallback((evt: FocusEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    validateInput(value);
    // ...
  }, []);

  const onChangeInput = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    validateInput(value);
    // ...
  };
  ```

### Step 4: Build the [External Store](https://github.com/duyetvv/react-validator-form/blob/main/src/validator/store.ts)

### Step 5: Embed store to the form with validation

```tsx
const store = createValidatorStore();

store.registerFields([
  { name: "username", isValid: false },
  { name: "password", isValid: false },
]);

function LoginWithStoreScreen() {
  const formState = useSyncExternalStore(store.subscribe, store.getSnapshot);

  const submit = () => {
    const message = formState ? "Form is valid" : "Form is not valid";
    window.alert(message);
  };

  return (
    <div>
      <Form onSubmit={submit}>
        <Textbox
          type="text"
          label="Username"
          name="username"
          rules={{ required: true, minLength: 5 }}
          store={store}
        />
        <Textbox
          type="text"
          label="Password"
          name="password"
          rules={{ required: true, minLength: 8 }}
          store={store}
        />
        <button>Submit</button>
      </Form>
    </div>
  );
}
```

## Live Demo [codesandbox](https://codesandbox.io/p/sandbox/fchvgf?file=%2Fsrc%2Fcomponents%2Ftextbox%2Fstyles.scss%3A13%2C14)

## License

MIT License
