# React Validation Template

Build your own React Validation Form

## Description

Sometimes, you need to build the special validator for the paticular purpose. But It's hard to custom the existing libraries in the market. You need to build yourself library, So here is one of the template you able to references.

## Idea

You have the input with the validation rules. And you want to split the validators individually, The Validator wont intersect to each others.

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
<LoginForm.Form onSubmit={submit}>
  <LoginForm.Textbox
    type="text"
    label="Username"
    name="username"
    rules={{ required: true, minLength: 5 }}
  />
  <LoginForm.Textbox
    type="text"
    label="Password"
    name="password"
    rules={{ required: true, minLength: 8 }}
  />
</LoginForm.Form>
```

The form status should reflected by the status of controls that registered to it throught the isValid variable from created Form.

```ts
const LoginForm = React.useMemo(
  () => createLoginForm(["username", "password"]),
  []
);
```

## Implementation

### Preposition

- Defined the types inside file `types/rules.ts`

```ts
/**
 * Enum for the available rule keys.
 * This provides a centralized definition of all possible validation rule names.
 */
export enum RuleKey {
  required = "required",
  phone = "phone",
}

/**
 * Type representing the name of a validation rule.
 * It's a union of all possible `RuleKey` values.
 */
export type RuleName = RuleKey.required | RuleKey.phone;

/**
 * Type for a collection of rules.
 * It's a key-value pair where the key is the rule name and the value is the rule argument.
 *
 * @example
 * const rules: Rules = {
 *   required: true,
 *   minLength: 8,
 * };
 */
export type Rules = {
  [key: string]: any;
};

/**
 * Type for the arguments that can be passed to a rule.
 * It can be a single string or an array of strings.
 */
export type ArgType = string | string[];

/**
 * Interface representing the parameters for a validation rule function.
 * This is the input for a validation function.
 */
export interface RuleParam {
  /** The value to be validated. */
  val: string;
  /** The name of the field being validated. */
  name: string;
  /** The arguments for the validation rule. */
  arg?: ArgType;
}

/**
 * Interface for the response of a validation rule.
 * This is part of the output of a validation function when validation fails.
 */
export interface RuleResponse {
  /** The name of the field that was validated. */
  name: string;
  /** The arguments that were used for the validation rule. */
  arg?: ArgType;
  /** A code representing the validation error. */
  code: string;
  /** The error message for the validation failure. */
  msg: string;
}

/**
 * Type for the result of a validation rule function.
 * This is the output of a validation function.
 */
export type RuleResult = {
  /** Whether the validation was successful. */
  isValid: boolean;
  /** The response of the validation rule, which is null if validation was successful. */
  res: RuleResponse | null;
};
```

- Defined the types of Validations inside file `types/validation.ts`

```ts

export const defIsValid = true;

export type ValidationResult = {
  isValid: boolean;
  res: RuleResponse | null;
};

export type ValidationSnapshot = {
  formName: string;
  isValid: boolean;
};
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

#### 1. Create the base class for Validator Rule. 
[Full code](https://github.com/duyetvv/react-validator-form/blob/main/src/rules/base.ts)
```ts
export abstract class BaseRule {
  abstract test(params: RuleParam): boolean;
  abstract res(params: RuleParam): RuleResponse;

  message(orgMsg: string, fieldName: string, arg: string): string {
    return orgMsg.replace("{#fieldName}", fieldName).replace("{#arg}", arg);
  }
}
```

#### 2. Create the specific validator rule.
[Full code]|(https://github.com/duyetvv/react-validator-form/blob/main/src/rules/required.ts)
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

#### The references for other rules should under folder `root/src/rules/{filename}.ts`

### Step 2: Create the validator

- Create the RulesMapping factory [code]|(https://github.com/duyetvv/react-validator-form/blob/main/src/validator/mapping.ts)

```ts
export const RulesMapping = [
  { ruleName: RuleKey.required, inst: new RequiredRuleInst() },
  { ruleName: RuleKey.phone, inst: new PhoneRule() },
  // ... Other Rules
];
```

- Create the Validator class at link with the validate function at: [code]|(https://github.com/duyetvv/react-validator-form/blob/main/src/validator/tmpValidator.ts)

```ts
 
class Validator {
  private static rules = new Map<string, BaseRule>();

  static init() {
    RulesMapping.forEach((rule) => {
      this.add(rule.ruleName, rule.inst);
    });
    return this;
  }

  static add(ruleName: string, ruleInst: BaseRule): void {
    this.rules.set(ruleName, ruleInst);
  }

  static get(ruleName: string): BaseRule {
    const rule = this.rules.get(ruleName);
    if (!rule) {
      throw new Error(`Rule "${ruleName}" is not registered`);
    }
    return rule;
  }

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

  static destroy() {
    this.rules.clear();
  }
}

// export the instance of Validator as the instance of Validator
export default Validator.init();
```

### Step 3: Use the validator with Input

- validate the input on blue event.

```tsx
const onBlurInput = (evt: FocusEvent<HTMLInputElement>) => {
  const { value } = evt.target;

  const result = validation.validate(rules, genericName || name, value);

  const errsMsg = result.reduce<Record<string, string>[]>(
    (accumulator, ele) => {
      if (!ele.isValid) {
        accumulator.push({
          code: ele.res?.code || "",
          message: ele.res?.msg || "",
        });
      }

      return accumulator;
    },
    []
  );

  setErrors(errsMsg);

  if (typeof onChangeText === "function") {
    onChangeText({ name, value });
  }
};
```
Refer full example input at: [textbox](https://github.com/duyetvv/react-validator-form/blob/main/src/components/textbox/index.tsx)

## License
