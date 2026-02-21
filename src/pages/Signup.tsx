import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Signup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [responseAlert, setResponseAlert] = useState({
		title: "",
		description: "",
		state: false,
		type: "success" as "success" | "destructive",
	});
	const [passwordMismatchError, setPasswordMismatchError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Add your sign-up logic here
			if (password !== confirmPassword) {
				setPasswordMismatchError(true);
				return;
			}

			try {
				console.log("Attempting to sign up with:", { name, email, password });
				console.log("Server URL:", import.meta.env.VITE_SERVER_URL);
				const response = await fetch(
					`${import.meta.env.VITE_SERVER_URL}/auth/signup`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ name, email, password }),
					},
				);

				if (!response.ok) {
					const errorData = await response.json();
					setResponseAlert({
						title: "Sign Up Failed",
						description:
							errorData.message ||
							"An error occurred during sign up.",
						state: true,
						type: "destructive",	
					});
					return;
				}
				console.log("Sign up successful:", response.ok, await response.json());
				setResponseAlert({
					title: "Sign Up Successful",
					description:
						"Your account has been created successfully. You can now log in.",
					state: true,
					type: "success",
				});
			} catch (error: any) {
				console.error(error);
				setResponseAlert({
					title: "Sign Up Failed",
					description: error.message,
					state: true,
					type: "destructive",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
			<Card className="w-full max-w-md border-border/60 shadow-lg">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl">
						Create your account
					</CardTitle>
					<CardDescription>
						Sign up to start managing your home inventory
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-5">
						{passwordMismatchError && (
							<Alert variant="destructive">
								<AlertTitle>Passwords do not match</AlertTitle>
								<AlertDescription>
									Please make sure both password fields are
									the same.
								</AlertDescription>
							</Alert>
						)}
						{responseAlert.state && (
							<Alert variant={responseAlert.type}>
								<AlertTitle>{responseAlert.title}</AlertTitle>
								<AlertDescription>
									{responseAlert.description}
								</AlertDescription>
							</Alert>
						)}
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="Your name"
								autoComplete="name"
								className="h-10"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
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
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								autoComplete="new-password"
								className="h-10"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									if (passwordMismatchError) {
										setPasswordMismatchError(false);
									}
								}}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirm-password">
								Confirm Password
							</Label>
							<Input
								id="confirm-password"
								type="password"
								placeholder="••••••••"
								autoComplete="new-password"
								className="h-10"
								value={confirmPassword}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
									if (passwordMismatchError) {
										setPasswordMismatchError(false);
									}
								}}
								required
							/>
						</div>
						<Button
							type="submit"
							className="h-10 w-full"
							disabled={isLoading}
						>
							{isLoading ? "Signing up..." : "Sign Up"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
