import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

import { IRecipe } from "@/model/recipe";
import { fetchRecipes } from "@/api/recipe";
import { Button } from "@/components/ui/button";

const Recipes = () => {
	const navigate = useNavigate();
	const [recipes, setRecipes] = useState<IRecipe[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		fetchRecipes()
			.then(setRecipes)
			.catch((err: Error) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
			<div className="mb-6 flex items-center justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold">Recipes</h1>
					<p className="text-muted-foreground text-sm">
						Browse and manage your household recipes.
					</p>
				</div>
				<Button
					size="sm"
					onClick={() => navigate("/recipes/new")}
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

			{!loading && !error && recipes.length === 0 && (
				<div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
					No recipes yet.
				</div>
			)}

			{!loading && !error && recipes.length > 0 && (
				<ul className="divide-y rounded-md border">
					{recipes.map((recipe) => (
						<li
							key={recipe._id}
							className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-muted/50"
							onClick={() => navigate(`/recipes/${recipe._id}`)}
						>
							<div className="space-y-0.5">
								<p className="font-medium">{recipe.name}</p>
								<p className="text-muted-foreground text-sm">
									{[
										recipe.type,
										recipe.portion !== undefined
											? `${recipe.portion} portion${recipe.portion !== 1 ? "s" : ""}`
											: undefined,
									]
										.filter(Boolean)
										.join(" · ")}
								</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Recipes;
