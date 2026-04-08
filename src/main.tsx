import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
	createBrowserRouter,
	Navigate,
	Outlet,
	RouterProvider,
} from "react-router";
import { LoginProvider, useLogin } from "./contexts/login-context.tsx";
import { HouseholdProvider } from "./contexts/household-context.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.tsx";
import { AppSidebar } from "./components/AppSidebar.tsx";
import HouseholdSelect from "./components/HouseholdSelect.tsx";

const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Welcome = lazy(() => import("./pages/Welcome.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const Shelves = lazy(() => import("./pages/Shelves.tsx"));
const Shops = lazy(() => import("./pages/Shops.tsx"));
const ShoppingLists = lazy(() => import("./pages/ShoppingLists.tsx"));
const ShoppingListForm = lazy(() => import("./pages/ShoppingListForm.tsx"));
const Recipes = lazy(() => import("./pages/Recipes.tsx"));
const RecipeForm = lazy(() => import("./pages/RecipeForm.tsx"));
const MealPlans = lazy(() => import("./pages/MealPlans.tsx"));
const MealForm = lazy(() => import("./pages/MealForm.tsx"));

function IndexRoute() {
	const { isLoggedIn } = useLogin();

	if (isLoggedIn) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Welcome />;
}

function ProtectedRoute() {
	const { isLoggedIn } = useLogin();

	if (!isLoggedIn) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}

function RootLayout() {
	const { isLoggedIn } = useLogin();

	return (
		<SidebarProvider>
			{isLoggedIn && <AppSidebar />}
			<SidebarInset className="bg-background text-foreground">
				{isLoggedIn && (
					<div className="flex items-center p-2">
						<SidebarTrigger />
						<div className="flex flex-1 justify-center">
							<HouseholdSelect />
						</div>
					</div>
				)}
				<Suspense fallback={null}>
					<Outlet />
				</Suspense>
			</SidebarInset>
		</SidebarProvider>
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
				path: "signup",
				Component: Signup,
			},
			{
				path: "login",
				Component: Login,
			},
			{
				Component: ProtectedRoute,
				children: [
					{
						path: "dashboard",
						Component: Dashboard,
					},
					{
						path: "settings",
						Component: Settings,
					},
					{
						path: "shelves",
						Component: Shelves,
					},
					{
						path: "shops",
						Component: Shops,
					},
					{
						path: "shopping-lists",
						Component: ShoppingLists,
					},
					{
						path: "shopping-lists/new",
						Component: ShoppingListForm,
					},
					{
						path: "shopping-lists/:id",
						Component: ShoppingListForm,
					},
					{
						path: "recipes",
						Component: Recipes,
					},
					{
						path: "recipes/new",
						Component: RecipeForm,
					},
					{
						path: "recipes/:id",
						Component: RecipeForm,
					},
					{
						path: "meal-plans",
						Component: MealPlans,
					},
					{
						path: "meal-plans/meal/new",
						Component: MealForm,
					},
					{
						path: "meal-plans/meal/:mealId/edit",
						Component: MealForm,
					},
				],
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
