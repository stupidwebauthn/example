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
import { Form, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import StupidWebauthnClient, {
  CredentialSelect,
  Login1ChallengeResponse,
} from "stupidwebauthn-client";
import useError from "../components/error.hook";
import { ArrowLeftIcon } from "lucide-react";

enum Step {
  input_email = 1,
  list_credentials = 2,
  authenticated = 3,
}

const client = new StupidWebauthnClient();

export default function Login() {
  const [step, _setStep] = useState<Step>(Step.input_email);
  const err = useError();
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

    err.asyncOrCatch(async () => {
      const res = await client.Login1Challenge(email);
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
        <Button
          as={Link}
          to="/"
          className="rounded-full w-8 h-8 min-w-min p-0 mt-2 mx-2"
          variant="flat"
        >
          <ArrowLeftIcon size={16} />
        </Button>
        <CardHeader>Login</CardHeader>
        <CardBody className="space-y-4">
          {step === Step.input_email ? (
            <Form onSubmit={onSubmitStep1} className="space-y-4">
              <Input
                type="email"
                name="email"
                label="Email"
                autoComplete="email webauthn"
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

          {err.render()}
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
