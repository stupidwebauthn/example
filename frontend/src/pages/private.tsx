import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Textarea,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import StupidWebauthnClient, { type UserJson } from "stupidwebauthn-client";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  LandmarkIcon,
  Trash2Icon,
  Undo2Icon,
} from "lucide-react";
import useError from "../components/error.hook";

const client = new StupidWebauthnClient();

export default function Private() {
  const navigate = useNavigate();
  const err = useError();
  const [user, setUser] = useState<UserJson | null>(null);
  const isUserGdprDateSet = !!user?.gdpr_delete_at;
  const [backendResult, setBackendResult] = useState("");
  const [gdprData, setGdprData] = useState<string>("");
  useEffect(() => {
    client
      .AuthValidate()
      .then(setUser)
      .catch((err) => {
        console.error(err);
        navigate("/");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function onLogout() {
    client.Logout().then(() => navigate("/"));
  }
  function onBackendData() {
    err.asyncOrCatch(async () => {
      const res = await fetch("/api/data");
      if (res.status >= 400) throw res.statusText + " " + (await res.text());
      const body = await res.json();
      const bodyBeautifyJson = JSON.stringify(body, null, "  ");
      setBackendResult(bodyBeautifyJson);
    });
  }
  function onGdprSet() {
    err.asyncOrCatch(async () => {
      const res = await client.GdprDeleteSet();
      setUser(res);
    });
  }
  function onGdprUnset() {
    err.asyncOrCatch(async () => {
      const res = await client.GdprDeleteUnset();
      setUser(res);
    });
  }
  function onGdprData() {
    err.asyncOrCatch(async () => {
      const res = await client.GdprData();
      const data = JSON.stringify(res, null, "  ");
      setGdprData(data);
    });
  }

  return (
    <div className="flex min-h-svh justify-center items-start py-24">
      <Card className="w-full max-w-96">
        <CardHeader>You are logged in</CardHeader>
        <CardBody className="space-y-4">
          <Button variant="flat" color="primary" onClick={onBackendData}>
            Request restricted backend data
          </Button>

          {backendResult ? (
            <Textarea
              isReadOnly
              label="Backend response data"
              variant="bordered"
              labelPlacement="outside"
              value={backendResult}
            />
          ) : null}

          {isUserGdprDateSet ? (
            <Button variant="flat" color="warning" onClick={onGdprUnset}>
              <Undo2Icon size={16} />
              Retract request gdpr data deletion
            </Button>
          ) : (
            <Button
              variant="flat"
              color="default"
              onClick={onGdprSet}
              className="text-danger"
            >
              <Trash2Icon size={16} />
              Request gdpr data deletion
            </Button>
          )}

          <Button variant="flat" color="default" onClick={onGdprData}>
            <LandmarkIcon size={16} />
            Request gdpr data
          </Button>

          {gdprData ? (
            <Textarea
              isReadOnly
              label="GDPR data"
              variant="bordered"
              labelPlacement="outside"
              value={gdprData}
            />
          ) : null}

          {err.render()}

          <Button color="danger" onClick={onLogout}>
            <ArrowLeftIcon size={16} />
            Logout
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
