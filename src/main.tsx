import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
	createBrowserRouter,
	Navigate,
	Outlet,
	RouterProvider,
} from "react-router";
import Dashboard from "./pages/Dashboard.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import Header from "./components/Header.tsx";
import { LoginProvider, useLogin } from "./contexts/login-context.tsx";
import Welcome from "./pages/Welcome.tsx";
import Settings from "./pages/Settings.tsx";
import { HouseholdProvider } from "./contexts/household-context.tsx";

function IndexRoute() {
	const { isLoggedIn } = useLogin();

	if (isLoggedIn) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Welcome />;
}

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
				Component: IndexRoute,
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
			{
				path: "/settings",
				Component: Settings,
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<LoginProvider>
			<HouseholdProvider>
				<RouterProvider router={router} />
			</HouseholdProvider>
		</LoginProvider>
	</StrictMode>,
);
