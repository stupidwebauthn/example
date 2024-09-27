/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Input,
  Progress,
} from "@nextui-org/react";
import { Form, useLocation, useNavigate } from "react-router-dom";
import StupidWebauthnClient from "stupidwebauthn-client";
import { useEffect, useState } from "react";
import queryString from "query-string";

const client = new StupidWebauthnClient();

enum Step {
  none = 0,
  input_email = 1,
  sent_email = 2,
  validating_email = 3,
  click_passkey = 4,
  authenticated = 5,
}

export default function Register() {
  const [step, _setStep] = useState<Step>(Step.none);
  const setStep = (s: Step) => {
    console.info("Step:", s);
    _setStep(s);
  };
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = queryString.parse(location.search) as { c?: string };
    // check if step 3
    if (params.c) {
      setStep(Step.validating_email);
      client.Register2EmailValidate(params.c).then(() => {
        setStep(Step.click_passkey);
      });
    } else {
      setStep(Step.input_email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmitStep1(e: any) {
    e.preventDefault();
    const email = e.target.email.value;
    client.Register1EmailChallenge(email).then(() => setStep(2));
  }

  function onSubmitStep4() {
    client.Register3PasskeyChallenge().then((res) =>
      client.Register4AuthorizePasskey(res.challenge).then((res2) =>
        client.Register5PasskeyValidate(res2).then(() => {
          setStep(Step.authenticated);
          setTimeout(() => {
            navigate("/private");
          }, 1300);
        })
      )
    );
  }

  return (
    <div className="flex min-h-svh justify-center items-center">
      <Card>
        <CardHeader>Register</CardHeader>
        <CardBody>
          {step == Step.input_email || step == Step.sent_email ? (
            <Form onSubmit={onSubmitStep1} className="space-y-4">
              <Input
                type="email"
                name="email"
                label="Email"
                isRequired
                required
              />

              <Button type="submit" color="primary" fullWidth>
                Register with your device
              </Button>

              {step == Step.sent_email ? (
                <Chip className="mx-auto flex text-center" color="secondary">
                  Verification email sent
                </Chip>
              ) : null}
            </Form>
          ) : step == Step.validating_email ? (
            <p>Email is being validated</p>
          ) : step == Step.click_passkey ? (
            <Button onClick={onSubmitStep4} color="primary">
              Add Passkey to your new account
            </Button>
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
