import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Progress,
} from "@nextui-org/react";
import { Form, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import StupidWebauthnClient from "stupidwebauthn-client";
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
  const [email, setEmail] = useState("");
  const [showRegisterLink, setShowRegisterLink] = useState(false);
  const err = useError();
  const setStep = (s: Step) => {
    console.info("Step:", s);
    _setStep(s);
  };
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onSubmitStep1(e: any) {
    e.preventDefault();
    const email = e.target.email.value;

    err.asyncOrCatch(async () => {
      const res1 = await client.Login1Challenge(email).catch((err) => {
        setShowRegisterLink(true);
        throw err;
      });
      setStep(Step.list_credentials);
      const res2 = await client.Login2Authenticate(res1).catch((err) => {
        setShowRegisterLink(true);
        throw err;
      });
      await client.Login3Verify(res2);
      setStep(Step.authenticated);
      setEmail("");
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
        <CardHeader>Login</CardHeader>
        <CardBody className="space-y-4">
          <Form onSubmit={onSubmitStep1} className="space-y-4">
            <Input
              type="email"
              name="email"
              label="Email"
              autoComplete="email webauthn"
              isRequired
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" color="primary" fullWidth>
              Login with your device
            </Button>
            {showRegisterLink ? (
              <Button
                as={Link}
                to={"/register?email=" + email}
                type="button"
                color="primary"
                variant="bordered"
                fullWidth
              >
                Register with email
              </Button>
            ) : null}
          </Form>

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
