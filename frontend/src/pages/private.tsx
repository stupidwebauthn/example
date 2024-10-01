import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import StupidWebauthnClient from "stupidwebauthn-client";
import { useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";

const client = new StupidWebauthnClient();

export default function Private() {
  const navigate = useNavigate();
  useEffect(() => {
    client.AuthValidate().catch((err) => {
      console.error(err);
      navigate("/");
    });
  }, []);
  function onLogout() {
    client.Logout().then(() => navigate("/"));
  }
  return (
    <div className="flex min-h-svh justify-center items-center">
      <Card>
        <CardHeader>You are logged in</CardHeader>
        <CardBody>
          <Button color="danger" onClick={onLogout}>
            <ArrowLeftIcon size={16} />
            <span className="me-4">Logout</span>
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
