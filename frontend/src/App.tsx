import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages";
import Register from "./pages/register";
import Private from "./pages/private";
import Login from "./pages/login";
import { Button, Link } from "@nextui-org/react";
import { BookOpenTextIcon, StarIcon } from "lucide-react";

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
          data-umami-event="Go to github"
          href="https://github.com/stupidwebauthn/example"
        >
          <StarIcon className="me-1 fill-yellow-400" strokeWidth={0} />
          Github
        </Button>
        <Button
          as={Link}
          target="_blank"
          variant="flat"
          data-umami-event="Go to documentation site"
          href="https://stupidwebauthn.site/"
        >
          <BookOpenTextIcon className="me-1 text-default-600" />
          Docs
        </Button>
      </div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
