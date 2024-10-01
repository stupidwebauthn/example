import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="flex min-h-svh justify-center items-start py-24">
      <Card className="w-full max-w-96">
        <CardHeader>Stupid Simple Passwordless Authentication</CardHeader>
        <CardBody className="gap-4">
          <Button as={Link} to="/login" color="primary">
            Login
          </Button>
          <Button as={Link} to="/register" color="primary" variant="bordered">
            Register
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
