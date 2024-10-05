import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Textarea,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import StupidWebauthnClient, { type UserJson } from "stupidwebauthn-client";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  LandmarkIcon,
  ShieldAlertIcon,
  ShieldIcon,
  ShieldPlusIcon,
  ShieldQuestionIcon,
  Trash2Icon,
  Undo2Icon,
} from "lucide-react";
import useError from "../components/error.hook";

const client = new StupidWebauthnClient();

type BackendOption = "default" | "csrf" | "double";
export default function Private() {
  const navigate = useNavigate();
  const err = useError();
  const [user, setUser] = useState<UserJson | null>(null);
  const isUserGdprDateSet = !!user?.gdpr_delete_at;
  const [backendResult, setBackendResult] = useState("");
  const [backendStatus, setBackendStatus] = useState<"done" | "changed">();
  const [gdprData, setGdprData] = useState<string>("");
  const [selectedBackendOption, setSelectedBackendOption] = useState(
    new Set<BackendOption>(["default"])
  );
  const selectedBackendOptionFirst = Array.from(selectedBackendOption)[0];

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
      let res: Response;
      switch (selectedBackendOptionFirst) {
        case "default":
          res = await fetch("/api/auth/data");
          break;
        case "csrf":
          await client.AuthCsrfChallenge();
          res = await fetch("/api/auth/csrf/data");
          break;
        case "double":
          await client.AuthDoubleCheck123();
          res = await fetch("/api/auth/doublecheck/data");
          break;
        default:
          throw "Invalid backend request option selected";
      }
      if (res.status >= 400) throw res.statusText + " " + (await res.text());
      const body = await res.json();
      const bodyBeautifyJson = JSON.stringify(body, null, "  ");
      setBackendResult(bodyBeautifyJson);
      setBackendStatus("changed");
      setTimeout(() => {
        setBackendStatus("done");
      }, 1000);
    });
  }
  function onGdprSet() {
    err.asyncOrCatch(async () => {
      await client.AuthDoubleCheck123();
      const res = await client.GdprDeleteSet();
      setUser(res);
    });
  }
  function onGdprUnset() {
    err.asyncOrCatch(async () => {
      await client.AuthDoubleCheck123();
      const res = await client.GdprDeleteUnset();
      setUser(res);
    });
  }
  function onGdprData() {
    err.asyncOrCatch(async () => {
      await client.AuthDoubleCheck123();
      const res = await client.GdprData();
      const data = JSON.stringify(res, null, "  ");
      setGdprData(data);
    });
  }
  function onPanic() {
    err.asyncOrCatch(async () => {
      await client.AuthDoubleCheck123();
      await client.AuthPanic();
      navigate("/");
    });
  }

  return (
    <div className="flex min-h-svh justify-center items-start py-24">
      <Card className="w-full max-w-96">
        <CardHeader>You are logged in</CardHeader>
        <CardBody className="space-y-4">
          <ButtonGroup fullWidth>
            <Button
              color="primary"
              variant="flat"
              onClick={onBackendData}
              className="justify-start"
            >
              Restricted backend data
              <small>
                {selectedBackendOptionFirst == "double"
                  ? "extra passkey check"
                  : selectedBackendOptionFirst == "csrf"
                  ? "csrf defense"
                  : "Without csrf"}
              </small>
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly>
                  <ChevronDownIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Merge options"
                selectedKeys={selectedBackendOption}
                selectionMode="single"
                onSelectionChange={setSelectedBackendOption as () => void}
                className="max-w-[300px]"
              >
                <DropdownSection title="Request restricted backend data">
                  <DropdownItem
                    key="default"
                    startContent={<ShieldQuestionIcon />}
                    description={
                      <>
                        <span className="text-danger-600">
                          Should only be used for web page requests!
                        </span>
                        <br />
                        Relies on the swa_auth cookie, vulnerable to csrf
                        attacks.
                      </>
                    }
                  >
                    Basic request
                  </DropdownItem>
                  <DropdownItem
                    key="csrf"
                    startContent={<ShieldIcon />}
                    description="Requires a csrf request just before running the main request"
                  >
                    Csrf guarded request
                  </DropdownItem>
                  <DropdownItem
                    key="double"
                    startContent={<ShieldPlusIcon />}
                    description="Needs to reauthenticate with a passkey"
                  >
                    Double check
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>

          {backendResult ? (
            <div className="relative">
              <Badge
                content=""
                color="success"
                shape="circle"
                isInvisible={backendStatus === "done"}
                classNames={{ base: "absolute bottom-4 right-4" }}
                isDot
              >
                <div />
              </Badge>
              <Textarea
                isReadOnly
                label="Backend response data"
                variant="bordered"
                labelPlacement="outside"
                value={backendResult}
              />
            </div>
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

          <Button color="danger" variant="bordered" onClick={onPanic}>
            <ShieldAlertIcon size={16} />
            Revoke all login-sessions and passkeys
          </Button>

          <Button color="danger" onClick={onLogout}>
            <ArrowLeftIcon size={16} />
            Logout
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
