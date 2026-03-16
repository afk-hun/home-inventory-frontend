import { NavLink, useNavigate } from "react-router";
import {
	LayoutDashboard,
	Archive,
	Store,
	ShoppingCart,
	ChefHat,
	CalendarDays,
	Settings,
	LogOut,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { ensureCsrfToken, getCsrfHeaders } from "@/lib/csrf";
import { useLogin } from "@/contexts/login-context";

const navItems = [
	{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ label: "Shelves", href: "/shelves", icon: Archive },
	{ label: "Shops", href: "/shops", icon: Store },
	{ label: "Shopping Lists", href: "/shopping-lists", icon: ShoppingCart },
	{ label: "Recipes", href: "/recipes", icon: ChefHat },
	{ label: "Meal Plans", href: "/meal-plans", icon: CalendarDays },
];

export function AppSidebar() {
	const { setIsLoggedIn } = useLogin();
	const navigate = useNavigate();
	const serverUrl = import.meta.env.VITE_SERVER_URL;

	const handleLogout = async () => {
		if (serverUrl && typeof serverUrl === "string") {
			try {
				await ensureCsrfToken(serverUrl);
				await fetch(`${serverUrl}/auth/logout`, {
					method: "POST",
					credentials: "include",
					headers: { ...getCsrfHeaders() },
				});
			} catch {
				// noop
			}
		}
		setIsLoggedIn(false);
		navigate("/login");
	};

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild tooltip="Home Inventory">
							<Link to="/dashboard">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-bold">
									🦔
								</div>
								<span className="font-semibold">Home Inventory</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton asChild tooltip={item.label}>
										<NavLink to={item.href}>
											<item.icon />
											<span>{item.label}</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarSeparator />
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip="Settings">
							<NavLink to="/settings">
								<Settings />
								<span>Settings</span>
							</NavLink>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip="Logout"
							onClick={handleLogout}
						>
							<LogOut />
							<span>Logout</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
