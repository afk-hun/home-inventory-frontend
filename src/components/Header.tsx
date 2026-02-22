import { useState } from "react";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLogin } from "@/contexts/login-context";
import { useNavigate } from "react-router";

const menuItems = [
	{ label: "Signup", href: "/signup", needsAuth: false },
	{ label: "Login", href: "/login", needsAuth: false },
	{ label: "Dashboard", href: "/dashboard", needsAuth: true },
];

export default function Header() {
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	const loginContext = useLogin();
	const navigate = useNavigate();
	const serverUrl = import.meta.env.VITE_SERVER_URL;

	const visibleMenuItems = menuItems.filter((item) =>
		item.needsAuth ? loginContext.isLoggedIn : !loginContext.isLoggedIn,
	);

	const handleLogout = async () => {
		if (serverUrl && typeof serverUrl === "string") {
			try {
				await fetch(`${serverUrl}/auth/logout`, {
					method: "POST",
					credentials: "include",
				});
			} catch {
				// noop
			}
		}

		loginContext.setIsLoggedIn(false);
		navigate("/login");
	};

	return (
		<header className="border-b bg-background">
			<div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
				<a href="/" className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-sm font-bold text-primary-foreground">
						🦔
					</div>
					<span className="text-lg font-semibold">
						Home Inventory
					</span>
				</a>

				<div className="hidden md:block">
					<NavigationMenu>
						<NavigationMenuList>
							{visibleMenuItems.map((item) => (
								<NavigationMenuItem key={item.label}>
									<NavigationMenuLink asChild>
										<a
											href={item.href}
											className={navigationMenuTriggerStyle()}
										>
											{item.label}
										</a>
									</NavigationMenuLink>
								</NavigationMenuItem>
							))}
							<NavigationMenuItem>
								{loginContext.isLoggedIn && (
									<NavigationMenuLink asChild>
										<button
											className={navigationMenuTriggerStyle()}
											onClick={async (event) => {
												event.preventDefault();
												await handleLogout();
											}}
										>
											Logout
										</button>
									</NavigationMenuLink>
								)}
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				<Button
					variant="ghost"
					className="md:hidden"
					onClick={() => setIsMobileOpen((prev) => !prev)}
					aria-expanded={isMobileOpen}
					aria-label="Toggle navigation menu"
				>
					Menu
				</Button>
			</div>

			<div
				className={cn(
					"md:hidden",
					isMobileOpen ? "block border-t" : "hidden",
				)}
			>
				<nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3">
					{visibleMenuItems.map((item) => (
						<a
							key={item.label}
							href={item.href}
							className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
							onClick={() => setIsMobileOpen(false)}
						>
							{item.label}
						</a>
					))}
				</nav>
			</div>
		</header>
	);
}
