import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import {
	LayoutDashboard,
	Archive,
	Store,
	ShoppingCart,
	ChefHat,
	CalendarDays,
	Settings,
	LogOut,
	MessageSquare,
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
	useSidebar,
} from "@/components/ui/sidebar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
	const { setOpenMobile } = useSidebar();
	const serverUrl = import.meta.env.VITE_SERVER_URL;
	const [feedbackOpen, setFeedbackOpen] = useState(false);

	const feedbackSrcDoc = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0px;font-family:sans-serif;}[class*="embeddedForm"]{width:unset!important;}</style></head><body><script id="76eb75bd-e8c6-4bab-8355-7b194f60032f" data-yt-url="https://afk.youtrack.cloud" src="https://afk.youtrack.cloud/static/simplified/form/form-entry.js" data-theme="light" data-lang="en"><\/script></body></html>`;

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
		<>
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
									<NavLink to={item.href} onClick={() => setOpenMobile(false)}>
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
						<SidebarMenuButton tooltip="Feedback" onClick={() => setFeedbackOpen(true)}>
							<MessageSquare />
							<span>Feedback</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip="Settings">
							<NavLink to="/settings" onClick={() => setOpenMobile(false)}>
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

		<Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Feedback</DialogTitle>
				</DialogHeader>
				<iframe srcDoc={feedbackSrcDoc} className="w-full border-none" style={{ height: 480 }} />
			</DialogContent>
		</Dialog>
		</>
	);
}
