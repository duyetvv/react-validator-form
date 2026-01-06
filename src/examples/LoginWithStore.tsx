import Form, { type FormProps } from "../components/form";
import Textbox, { type TextBoxProps } from "../components/textbox";
import { createValidatorStore } from "../validator/store";
// import { useFormState } from "../validator/hook";
// import { useSyncExternalStore } from "react";

const createLoginFormStore = () => {
  const store = createValidatorStore("login");
  store.registerFields([
    { name: "username", isValid: false },
    { name: "password", isValid: false },
  ]);

  // const formState = useSyncExternalStore(
  //   store.subscribe,
  //   store.getSnapshot,
  //   store.getSnapshot
  // );

  console.log("createLoginFormStore run", store, store.getSnapshot());
  return {
    isValid: store.getSnapshot().isValid,
    Form: (props: FormProps) => <Form {...props} />,
    Textbox: (props: TextBoxProps) => <Textbox {...props} store={store} />,
  };
};

const LoginForm = createLoginFormStore();

function LoginScreen() {
  const submit = () => {
    const message = LoginForm.isValid ? "Form is valid" : "Form is not valid";
    window.alert(message);
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
        <button>Submit</button>
      </LoginForm.Form>
    </div>
  );
}

export default LoginScreen;
