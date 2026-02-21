import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Dashboard from "./pages/Dashboard.tsx";
import Signup from "./pages/Signup.tsx";

let router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/signup",
    Component: Signup,
  },
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
