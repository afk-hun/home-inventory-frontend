import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

const Welcome = () => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
			<Card className="w-full max-w-md border-border/60 shadow-lg">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl">Welcome to Home Inventory</CardTitle>
					<CardDescription>
						Please log in to manage your inventory and keep track of your
						belongings.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<Button variant="outline" asChild>
						<Link to="/login">Log In</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link to="/signup">Register</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default Welcome;