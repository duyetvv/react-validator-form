import React from "react";

import Form, { type FormProps } from "../components/form";
import Textbox, { type TextBoxProps } from "../components/textbox";
import { createValidatorStore } from "../validator/store";

export function createLoginForm(fieldNames: string[] = []) {
  const store = createValidatorStore("login");

  if (fieldNames.length) {
    store.registerFields(fieldNames);
  }

  return {
    isValid: store.getSnapshot().isValid,
    Form: (props: FormProps) => <Form {...props} />,
    Textbox: (props: TextBoxProps) => (
      <Textbox {...props} store={store} />
    ),
  };
}

function LoginScreen() {
  const LoginForm = React.useMemo(
    () => createLoginForm(["username", "password"]),
    []
  );

  const submit = () => {
    console.log("Submit ", LoginForm.isValid);
  };

  return (
    <div>
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
    </div>
  );
}

export default LoginScreen;
