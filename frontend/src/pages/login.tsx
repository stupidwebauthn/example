import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Menu,
  MenuItem,
  Progress,
} from "@nextui-org/react";
import { Form, useNavigate } from "react-router-dom";
import { useState } from "react";
import StupidWebauthnClient, {
  CredentialSelect,
  Login1ChallengeResponse,
} from "stupidwebauthn-client";

enum Step {
  input_email = 1,
  list_credentials = 2,
  authenticated = 3,
}

const client = new StupidWebauthnClient();

export default function Login() {
  const [step, _setStep] = useState<Step>(Step.input_email);
  const setStep = (s: Step) => {
    console.info("Step:", s);
    _setStep(s);
  };
  const navigate = useNavigate();
  const [loginChallenge, setLoginChallenge] = useState<
    Login1ChallengeResponse | undefined
  >();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onSubmitStep1(e: any) {
    e.preventDefault();
    const email = e.target.email.value;
    client.Login1Challenge(email).then((res) => {
      setLoginChallenge(res);
      setStep(Step.list_credentials);
    });
  }
  function onSelectCredential(credential: CredentialSelect) {
    if (!loginChallenge) throw "login challenge not found";
    client
      .Login2Authenticate(loginChallenge.challenge, credential.credential)
      .then((res) =>
        client.Login3Validate(res, credential.id).then(() => {
          setStep(Step.authenticated);
          setTimeout(() => {
            navigate("/private");
          }, 1300);
        })
      );
  }

  return (
    <div className="flex min-h-svh justify-center items-center">
      <Card>
        <CardHeader>Login</CardHeader>
        <CardBody className="space-y-4">
          {step === Step.input_email ? (
            <Form onSubmit={onSubmitStep1} className="space-y-4">
              <Input
                type="email"
                name="email"
                label="Email"
                isRequired
                required
              />

              <Button type="submit" color="primary" fullWidth>
                Login with your device
              </Button>
            </Form>
          ) : step === Step.list_credentials ? (
            <Menu>
              {loginChallenge
                ? loginChallenge.credentials.map((credential) => (
                    <MenuItem
                      key={credential.id}
                      onClick={() => onSelectCredential(credential)}
                    >
                      {credential.name}
                    </MenuItem>
                  ))
                : []}
            </Menu>
          ) : null}
        </CardBody>
        <CardFooter>
          <Progress
            label={"Step: " + Step[step]}
            value={step}
            minValue={0}
            maxValue={Step.authenticated}
            color={step === Step.authenticated ? "success" : "primary"}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
