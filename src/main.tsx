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
import { LoginProvider, useLogin } from "./contexts/login-context.tsx";
import Welcome from "./pages/Welcome.tsx";
import Settings from "./pages/Settings.tsx";
import Shelves from "./pages/Shelves.tsx";
import Shops from "./pages/Shops.tsx";
import ShoppingLists from "./pages/ShoppingLists.tsx";
import ShoppingListForm from "./pages/ShoppingListForm.tsx";
import Recipes from "./pages/Recipes.tsx";
import RecipeForm from "./pages/RecipeForm.tsx";
import MealPlans from "./pages/MealPlans.tsx";
import MealForm from "./pages/MealForm.tsx";
import { HouseholdProvider } from "./contexts/household-context.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.tsx";
import { AppSidebar } from "./components/AppSidebar.tsx";
import HouseholdSelect from "./components/HouseholdSelect.tsx";

function IndexRoute() {
	const { isLoggedIn } = useLogin();

	if (isLoggedIn) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Welcome />;
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
				<Outlet />
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
