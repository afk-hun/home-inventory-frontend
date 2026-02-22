import { useState } from "react";
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
import { useLogin } from "@/contexts/login-context";
import { useNavigate } from "react-router";

export default function Login() {
	const [email, setEmail] = useState("");
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setResponseAlert((prev) => ({ ...prev, state: false }));

		try {
			const serverUrl = import.meta.env.VITE_SERVER_URL;
			if (!serverUrl || typeof serverUrl !== "string") {
				showResponseAlert(
					"Configuration Error",
					"Server URL is not configured. Please set VITE_SERVER_URL and try again.",
					"destructive",
				);
				return;
			}

			const response = await fetch(`${serverUrl}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				showResponseAlert(
					"Login Failed",
					errorData.message || "Invalid email or password.",
					"destructive",
				);
				return;
			}

			const data = await response.json();
			loginContext.setUser({ id: data.userId, token: data.token });
			
			showResponseAlert(
				"Login Successful",
				"You are now logged in.",
				"success",
			);
			setPassword("");

			navigate("/dashboard");
		} catch (error: any) {
			const message =
				error instanceof Error
					? error.message
					: typeof error === "string"
						? error
						: "An unexpected error occurred during login.";
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