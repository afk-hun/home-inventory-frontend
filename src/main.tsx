import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router";
import Dashboard from "./pages/Dashboard.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import Header from "./components/Header.tsx";
import { LoginProvider } from "./contexts/login-context.tsx";

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Outlet />
    </div>
  );
}

let router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "signup",
        Component: Signup,
      },
      {
        path: "login",
        Component: Login,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<LoginProvider>
			<RouterProvider router={router} />
		</LoginProvider>
	</StrictMode>,
);
