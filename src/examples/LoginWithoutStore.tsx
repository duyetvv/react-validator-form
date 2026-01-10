import { useCallback, useState } from "react";
import Form from "../components/form";
import Textbox, { type InteractEvent } from "../components/textbox";

function LoginWithoutStoreScreen() {
  const [isFormValid, setIsFormValid] = useState(true);

  const submit = () => {
    const message = isFormValid ? "Form is valid" : "Form is not valid";
    window.alert(message);
  };

  const onChangeText = useCallback(
    ({ name, value, isValid }: InteractEvent) => {
      console.log("onChangeText: ", name, value, isValid);

      setIsFormValid((oldValue) => oldValue && (isValid || false));
    },
    []
  );

  return (
    <div>
      <Form onSubmit={submit}>
        <Textbox
          type="text"
          label="Username"
          name="username"
          onChangeText={onChangeText}
          rules={{ required: true, minLength: 5 }}
        />
        <Textbox
          type="text"
          label="Password"
          name="password"
          onChangeText={onChangeText}
          rules={{ required: true, minLength: 8 }}
        />

        <button>Submit</button>

        <hr />
        <span>Form is {isFormValid ? "valid" : "not valid"}</span>
      </Form>
    </div>
  );
}

export default LoginWithoutStoreScreen;
