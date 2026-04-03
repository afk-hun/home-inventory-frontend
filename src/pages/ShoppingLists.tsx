import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

import { IShoppingList } from "@/model/shoppingList";
import { fetchShoppingLists } from "@/api/shoppingList";
import { Button } from "@/components/ui/button";

const ShoppingLists = () => {
	const navigate = useNavigate();
	const [lists, setLists] = useState<IShoppingList[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		fetchShoppingLists()
			.then(setLists)
			.catch((err: Error) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
			<div className="mb-6 flex items-center justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold">Shopping Lists</h1>
					<p className="text-muted-foreground text-sm">
						Create and manage your shopping lists.
					</p>
				</div>
				<Button
					size="sm"
					onClick={() => navigate("/shopping-lists/new")}
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>

			{loading && (
				<p className="text-muted-foreground text-sm">Loading…</p>
			)}

			{error && (
				<p className="text-destructive text-sm">{error}</p>
			)}

			{!loading && !error && lists.length === 0 && (
				<div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
					No shopping lists yet. Press <strong>+</strong> to create one.
				</div>
			)}

			{!loading && !error && lists.length > 0 && (
				<ul className="divide-y rounded-md border">
					{lists.map((list) => (
						<li
							key={list._id}
							className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-muted/50"
							onClick={() => navigate(`/shopping-lists/${list._id}`)}
						>
							<div className="space-y-0.5">
								<p className="font-medium">{list.name}</p>
								<p className="text-muted-foreground text-sm">
									{list.items.length} item{list.items.length !== 1 ? "s" : ""}
								</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default ShoppingLists;
