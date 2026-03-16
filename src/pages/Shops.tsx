import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Shops = () => {
	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold">Shops</h1>
				<p className="text-muted-foreground text-sm">
					Manage stores and link them to your invoices.
				</p>
			</div>
			<Card className="border-border/60">
				<CardHeader>
					<CardTitle>Coming Soon</CardTitle>
					<CardDescription>Shop management is under construction.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
						This feature is not yet available.
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Shops;
