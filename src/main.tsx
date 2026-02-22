import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Dashboard from "./pages/Dashboard.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import Header from "./components/Header.tsx";
import { LoginProvider } from "./contexts/login-context.tsx";

let router = createBrowserRouter([
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/login",
    Component: Login,
  },
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
    <div className="min-h-screen bg-background text-foreground">
      <LoginProvider>
        <Header />
        <RouterProvider router={router} />
      </LoginProvider>
    </div>
	</StrictMode>,
);
