import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages";
import Register from "./pages/register";
import Private from "./pages/private";
import Login from "./pages/login";
import { Avatar, Button, Link } from "@nextui-org/react";
import { StarIcon } from "lucide-react";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/private",
      element: <Private />,
    },
  ]);

  return (
    <div className="bg-background text-foreground">
      <div className="w-full flex flex-row-reverse items-center gap-4 p-4 absolute top-0">
        <Button
          as={Link}
          target="_blank"
          color="primary"
          href="https://github.com/stupidwebauthn/example"
        >
          <StarIcon className="me-1 fill-yellow-400" strokeWidth={0} />
          Github
        </Button>
        <Button
          as={Link}
          target="_blank"
          variant="flat"
          href="https://github.com/lil5"
        >
          <Avatar
            className="w-6 h-6"
            src="https://avatars.githubusercontent.com/u/17646836?v=4"
          ></Avatar>
          Lucian Last
        </Button>
      </div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
