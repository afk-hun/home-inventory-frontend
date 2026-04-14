import { fetchFavoriteItems, removeFavoriteItem, removeOneFavoriteItem } from "@/api/item";
import { fetchHouseholds } from "@/api/household";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHousehold } from "@/contexts/household-context";
import { IFavoriteItem } from "@/model/favoriteItem";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

function Dashboard() {
	const { setHouseholds } = useHousehold();
	const [favorites, setFavorites] = useState<IFavoriteItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [actionItemId, setActionItemId] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		Promise.all([fetchHouseholds(), fetchFavoriteItems()])
			.then(([households, favoriteItems]) => {
				setHouseholds(households);
				setFavorites(favoriteItems);
			})
			.catch((err) => {
				console.error("Error fetching dashboard data:", err);
				setError(err instanceof Error ? err.message : "Failed to load dashboard.");
			})
			.finally(() => setLoading(false));
	}, []);

	const handleRemoveFavorite = (itemId: string) => {
		setActionItemId(itemId);
		setError(null);
		removeFavoriteItem(itemId)
			.then(() => {
				setFavorites((prev) => prev.filter((favorite) => favorite._id !== itemId));
			})
			.catch((err: Error) => {
				setError(err.message);
			})
			.finally(() => setActionItemId(null));
	};

	const handleRemoveOne = (itemId: string) => {
		setActionItemId(itemId);
		setError(null);
		removeOneFavoriteItem(itemId)
			.then((favorite) => {
				setFavorites((prev) => prev.map((entry) => (entry._id === itemId ? favorite : entry)));
			})
			.catch((err: Error) => {
				setError(err.message);
			})
			.finally(() => setActionItemId(null));
	};

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold">Dashboard</h1>
				<p className="text-muted-foreground text-sm">
					Overview of your households, favorites, and meal plans.
				</p>
			</div>
			<Card className="mb-6 border-border/60">
				<CardHeader>
					<CardTitle>Favorite Items</CardTitle>
					<CardDescription>Quick access to the items you use most often.</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p className="text-sm text-muted-foreground">Loading…</p>
					) : favorites.length === 0 ? (
						<div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
							No favorite items yet.
						</div>
					) : (
						<div className="divide-y rounded-md border">
							{favorites.map((favorite) => {
								const isBusy = actionItemId === favorite._id;
								return (
									<div key={favorite._id} className="flex items-center gap-3 px-4 py-3">
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 text-amber-500 hover:text-amber-600"
											onClick={() => handleRemoveFavorite(favorite._id)}
											disabled={isBusy}
											aria-label="Remove item from favorites"
										>
											<Star className="h-4 w-4 fill-current" />
										</Button>
										<div className="min-w-0 flex-1">
											<div className="truncate text-sm font-medium">{favorite.name}</div>
											<div className="text-sm text-muted-foreground">
												{favorite.isAvailable
													? `${favorite.quantity} ${favorite.unit || ""}`.trim()
													: "This item is not available at home."}
											</div>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleRemoveOne(favorite._id)}
											disabled={isBusy || !favorite.isAvailable}
										>
											Remove one
										</Button>
									</div>
								);
							})}
						</div>
					)}
					{error && <p className="mt-3 text-sm text-destructive">{error}</p>}
				</CardContent>
			</Card>
		</div>
	);
}

export default Dashboard;
