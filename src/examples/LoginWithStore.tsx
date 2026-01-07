import { useSyncExternalStore } from "react";

import Form from "../components/form";
import Textbox from "../components/textbox";
import { createValidatorStore } from "../validator/store";

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
        <hr />
        <span>Form is {formState ? "valid" : "not valid"}</span>
      </Form>
    </div>
  );
}

export default LoginWithStoreScreen;
