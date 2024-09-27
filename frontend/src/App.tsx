import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages";
import Register from "./pages/register";
import Private from "./pages/private";
import Login from "./pages/login";

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
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
