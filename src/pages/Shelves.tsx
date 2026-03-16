import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Shelves = () => {
	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold">Shelves</h1>
				<p className="text-muted-foreground text-sm">
					Manage your shelves and their contents.
				</p>
			</div>
			<Card className="border-border/60">
				<CardHeader>
					<CardTitle>Coming Soon</CardTitle>
					<CardDescription>Shelf management is under construction.</CardDescription>
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

export default Shelves;
