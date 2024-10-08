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
import { Form, Link, useLocation, useNavigate } from "react-router-dom";
import StupidWebauthnClient from "stupidwebauthn-client";
import { useEffect, useState } from "react";
import queryString from "query-string";
import useError from "../components/error.hook";
import { ArrowLeftIcon } from "lucide-react";

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
  const [email, setEmail] = useState("");
  const err = useError();
  const setStep = (s: Step) => {
    console.info("Step:", s);
    _setStep(s);
  };
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    err.asyncOrCatch(async () => {
      const params = queryString.parse(location.search) as {
        c?: string;
        email?: string;
      };

      // check if step 3
      if (params.c) {
        setStep(Step.validating_email);
        await client.Register2EmailVerify(params.c);
        setStep(Step.click_passkey);
      } else {
        setStep(Step.input_email);
        setEmail(params.email || "");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmitStep1(e: any) {
    e.preventDefault();
    const email = e.target.email.value;

    err.asyncOrCatch(async () => {
      await client.Register1EmailChallenge(email);
      setStep(Step.sent_email);
    });
  }

  function onSubmitStep4() {
    err.asyncOrCatch(async () => {
      const res1 = await client.Register3PasskeyChallenge();
      const res2 = await client.Register4PasskeyRegister(res1);
      await client.Register5PasskeyVerify(res2);
      setStep(Step.authenticated);
      setTimeout(() => {
        navigate("/private");
      }, 1300);
    });
  }

  function onSubmitNoPasskey() {
    err.asyncOrCatch(async () => {
      await client.Register3NoPasskeyLogin();
      setStep(Step.authenticated);
      setTimeout(() => {
        navigate("/private");
      }, 1300);
    });
  }

  return (
    <div className="flex min-h-svh justify-center items-start py-24">
      <Card className="w-full max-w-96">
        <Button
          as={Link}
          to="/"
          className="rounded-full w-8 h-8 min-w-min p-0 mt-2 mx-2"
          variant="flat"
        >
          <ArrowLeftIcon size={16} />
        </Button>
        <CardHeader>Register</CardHeader>
        <CardBody className="space-y-4">
          {step == Step.input_email || step == Step.sent_email ? (
            <Form onSubmit={onSubmitStep1} className="space-y-4">
              <Input
                type="email"
                name="email"
                label="Email"
                autoComplete="email"
                isRequired
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <>
              <Button onClick={onSubmitStep4} color="primary">
                Add Passkey to your new account
              </Button>
              <Button onClick={onSubmitNoPasskey} color="primary">
                Login without passkey <small>with limited access</small>
              </Button>
            </>
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
