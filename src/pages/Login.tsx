import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ensureCsrfToken, getCsrfHeaders } from "@/lib/csrf";
import { useLogin } from "@/contexts/login-context";
import { useNavigate } from "react-router";
import { SERVER_URL } from "@/utils/constAndTypes";

export default function Login() {
	const [email, setEmail] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [responseAlert, setResponseAlert] = useState({
		title: "",
		description: "",
		state: false,
		type: "success" as "success" | "destructive",
	});

	const loginContext = useLogin();
	const navigate = useNavigate();

	const showResponseAlert = (
		title: string,
		description: string,
		type: "success" | "destructive",
	) => {
		setResponseAlert({
			title,
			description,
			state: true,
			type,
		});
	};

	useEffect(() => {
		if (isLoggedIn) {
			const timer = setTimeout(() => {
				navigate("/dashboard");
				setIsLoggedIn(false); // Reset local state after navigating
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [isLoggedIn]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setResponseAlert((prev) => ({ ...prev, state: false }));

		try {
			// const serverUrl = import.meta.env.VITE_SERVER_URL;
			if (!SERVER_URL || typeof SERVER_URL !== "string") {
				showResponseAlert(
					"Configuration Error",
					"Server URL is not configured. Please set VITE_SERVER_URL and try again.",
					"destructive",
				);
				return;
			}

			await ensureCsrfToken(SERVER_URL);

			const response = await fetch(`${SERVER_URL}/auth/login`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					...getCsrfHeaders(),
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				let errorMessage = "Invalid email or password.";

				try {
					const errorText = await response.text();

					if (errorText) {
						try {
							const parsed = JSON.parse(errorText);
							if (parsed && typeof parsed.message === "string") {
								errorMessage = parsed.message;
							} else {
								errorMessage = errorText;
							}
						} catch {
							errorMessage = errorText;
						}
					}
				} catch {
					// Ignore body parsing errors and fall back to default errorMessage
				}

				showResponseAlert("Login Failed", errorMessage, "destructive");
				return;
			}

			await response.json();
			// TODO store user data if it is necessary in the future. For now we just check if the response is valid and log the user in
			// if (
			// 	!data ||
			// 	typeof data !== "object" ||
			// 	typeof (data as any).userId !== "string"
			// ) {
			// 	showResponseAlert(
			// 		"Login Failed",
			// 		"Received invalid response from the server. Please try again.",
			// 		"destructive",
			// 	);
			// 	return;
			// }

			loginContext.setIsLoggedIn(true);

			showResponseAlert(
				"Login Successful",
				"You are now logged in.",
				"success",
			);
			setEmail("");
			setPassword("");

			setIsLoggedIn(true);
		} catch (error: any) {
			const message =
				error instanceof Error
					? error.message
					: typeof error === "string"
						? error
						: "An unexpected error occurred during login.";

			console.error("Login error:", error, message);
			showResponseAlert("Login Failed", message, "destructive");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
			<Card className="w-full max-w-md border-border/60 shadow-lg">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl">Welcome back</CardTitle>
					<CardDescription>
						Log in to access your home inventory
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-5">
						{responseAlert.state && (
							<Alert variant={responseAlert.type}>
								<AlertTitle>{responseAlert.title}</AlertTitle>
								<AlertDescription>
									{responseAlert.description}
								</AlertDescription>
							</Alert>
						)}
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								autoComplete="email"
								className="h-10"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
								title="Please enter a valid email address in the format name@example.com."
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<PasswordInput
								id="password"
								placeholder="••••••••"
								autoComplete="current-password"
								className="h-10"
								showStrengthBadge={false}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<Button
							type="submit"
							className="h-10 w-full"
							disabled={isLoading}
						>
							{isLoading ? "Logging in..." : "Log In"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
