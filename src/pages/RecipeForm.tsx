import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Trash2, Pencil } from "lucide-react";

import { IIngredient } from "@/model/recipe";
import { IItem } from "@/model/item";
import { IRecipeType } from "@/model/recipeType";
import { fetchItems } from "@/api/item";
import { fetchRecipe, createRecipe, updateRecipe } from "@/api/recipe";
import { fetchRecipeTypes } from "@/api/recipeType";
import AddIngredientDialog from "@/components/recipes/AddIngredientDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const NONE = "__none__";

interface IngredientWithName {
	ingredient: IIngredient;
	itemName: string;
}

const RecipeForm = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id?: string }>();
	const isNew = !id;
	const [isEditing, setIsEditing] = useState<boolean>(!id);

	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [portion, setPortion] = useState<string>("");
	const [type, setType] = useState<string>(NONE);
	const [ingredients, setIngredients] = useState<IngredientWithName[]>([]);
	const [allAvailableItems, setAllAvailableItems] = useState<IItem[]>([]);
	const [recipeTypes, setRecipeTypes] = useState<IRecipeType[]>([]);

	const [loading, setLoading] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [ingredientDialogOpen, setIngredientDialogOpen] = useState<boolean>(false);
	const [editingIngredientIndex, setEditingIngredientIndex] = useState<number | null>(null);

	useEffect(() => {
		fetchItems()
			.then(setAllAvailableItems)
			.catch((err) => console.error(err));
		fetchRecipeTypes()
			.then(setRecipeTypes)
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		setError(null);
		fetchRecipe(id)
			.then((recipe) => {
				setName(recipe.name);
				setDescription(recipe.description ?? "");
				setPortion(recipe.portion !== undefined ? String(recipe.portion) : "");
				setType(recipe.type || NONE);
				fetchItems()
					.then((items) => {
						// setAvailableItems(items);
						const mapped: IngredientWithName[] = recipe.ingredients.map((ing) => {
							const found = items.find((i) => i._id === ing.item);
							return { ingredient: ing, itemName: found ? found.name : ing.item };
						});
						setIngredients(mapped);
					})
					.catch((err) => console.error(err));
			})
			.catch((err: Error) => setError(err.message))
			.finally(() => setLoading(false));
	}, [id]);

	const handleAddIngredient = (ingredient: IIngredient, itemName: string) => {
		if (editingIngredientIndex !== null) {
			// Editing existing ingredient
			setIngredients((prev) =>
				prev.map((entry, i) =>
					i === editingIngredientIndex
						? { ingredient, itemName }
						: entry,
				),
			);
			setEditingIngredientIndex(null);
		} else {
			// Adding new ingredient
			setIngredients((prev) => [...prev, { ingredient, itemName }]);
		}
	};

	const handleEditIngredient = (index: number) => {
		setEditingIngredientIndex(index);
		setIngredientDialogOpen(true);
	};

	const handleIngredientDialogOpenChange = (open: boolean) => {
		if (!open) {
			setEditingIngredientIndex(null);
		}
		setIngredientDialogOpen(open);
	};

	const handleRemoveIngredient = (index: number) => {
		setIngredients((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSave = () => {
		const trimmedName = name.trim();
		if (!trimmedName) {
			setError("Recipe name is required.");
			return;
		}
		const parsedPortion = portion !== "" ? parseFloat(portion) : undefined;
		const payload = {
			name: trimmedName,
			type: type !== NONE ? type : undefined,
			description: description.trim() || undefined,
			portion: parsedPortion,
			ingredients: ingredients.map((i) => i.ingredient),
		};
		setSaving(true);
		setError(null);
		if (!isNew && id) {
			updateRecipe(id, payload)
				.then(() => { setIsEditing(false); })
				.catch((err: Error) => setError(err.message))
				.finally(() => setSaving(false));
		} else {
			createRecipe(payload)
				.then(() => navigate("/recipes"))
				.catch((err: Error) => setError(err.message))
				.finally(() => setSaving(false));
		}
	};

	if (loading) {
		return (
			<div className="mx-auto w-full max-w-2xl px-4 py-8 md:py-10">
				<p className="text-muted-foreground text-sm">Loading…</p>
			</div>
		);
	}

	// View mode — read-only display
	if (!isEditing) {
		return (
			<div className="mx-auto w-full max-w-2xl px-4 py-8 md:py-10">
				<div className="mb-6 flex items-start justify-between">
					<div className="space-y-1">
						<h1 className="text-2xl font-semibold">{name}</h1>
						{(type !== NONE || portion !== "") && (
							<p className="text-muted-foreground text-sm">
								{[
									type !== NONE ? type : undefined,
									portion !== ""
										? `${portion} portion${Number(portion) !== 1 ? "s" : ""}`
										: undefined,
								]
									.filter(Boolean)
									.join(" · ")}
							</p>
						)}
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
						onClick={() => setIsEditing(true)}
					>
						<Pencil className="h-4 w-4" />
					</Button>
				</div>

				{description && (
					<p className="text-muted-foreground mb-6 text-sm">{description}</p>
				)}

				<div className="space-y-2">
					<h2 className="text-sm font-medium">Ingredients</h2>
					{ingredients.length === 0 ? (
						<p className="text-muted-foreground text-sm italic">No ingredients listed.</p>
					) : (
						<ul className="divide-y rounded-md border">
							{ingredients.map((entry, index) => (
								<li key={index} className="px-3 py-2 text-sm">
									<span className="font-medium">{entry.itemName}</span>
									<span className="text-muted-foreground">
										{" — "}{entry.ingredient.quantity}
										{entry.ingredient.unit ? ` ${entry.ingredient.unit}` : ""}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>

				<div className="mt-6">
					<Button variant="outline" onClick={() => navigate("/recipes")}>
						Back
					</Button>
				</div>
			</div>
		);
	}

	// Edit / create mode
	return (
		<div className="mx-auto w-full max-w-2xl px-4 py-8 md:py-10">
			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold">
					{isNew ? "New Recipe" : "Edit Recipe"}
				</h1>
				<p className="text-muted-foreground text-sm">
					{isNew ? "Fill in the details to create a new recipe." : "Update the recipe details below."}
				</p>
			</div>

			<div className="space-y-5">
				<div className="space-y-1.5">
					<Label htmlFor="recipe-name">Title <span className="text-destructive">*</span></Label>
					<Input
						id="recipe-name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Spaghetti Bolognese"
						disabled={saving}
					/>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="recipe-description">Description</Label>
					<Textarea
						id="recipe-description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="A short description of the recipe…"
						disabled={saving}
						rows={3}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<Label htmlFor="recipe-portion">Portions</Label>
						<Input
							id="recipe-portion"
							type="number"
							min="0"
							value={portion}
							onChange={(e) => setPortion(e.target.value)}
							placeholder="e.g. 4"
							disabled={saving}
						/>
					</div>

					<div className="space-y-1.5">
						<Label>Type</Label>
						<Select value={type} onValueChange={setType} disabled={saving}>
							<SelectTrigger>
								<SelectValue placeholder="—" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NONE}>—</SelectItem>
								{recipeTypes.map((rt) => (
									<SelectItem key={rt._id} value={rt.name}>
										{rt.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label>Ingredients</Label>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIngredientDialogOpen(true)}
							disabled={saving}
						>
							Add Ingredient
						</Button>
					</div>

					{ingredients.length === 0 ? (
						<div className="text-muted-foreground rounded-md border border-dashed p-4 text-center text-sm">
							No ingredients added yet.
						</div>
					) : (
						<ul className="divide-y rounded-md border">
							{ingredients.map((entry, index) => (
								<li
									key={index}
									className="flex items-center justify-between px-3 py-2"
								>
									<span className="text-sm">
										<span className="font-medium">{entry.itemName}</span>
										<span className="text-muted-foreground">
											{" — "}{entry.ingredient.quantity}
											{entry.ingredient.unit ? ` ${entry.ingredient.unit}` : ""}
										</span>
									</span>
									<div className="flex gap-1">
										<Button
											variant="ghost"
											size="sm"
											className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
											onClick={() => handleEditIngredient(index)}
											disabled={saving}
											title="Edit ingredient"
										>
											<Pencil className="h-3.5 w-3.5" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
											onClick={() => handleRemoveIngredient(index)}
											disabled={saving}
											title="Remove ingredient"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				{error && <p className="text-destructive text-sm">{error}</p>}

				<div className="flex gap-3 pt-2">
					<Button onClick={handleSave} disabled={saving}>
						{saving ? "Saving…" : "Save"}
					</Button>
					<Button
						variant="outline"
						onClick={() => isNew ? navigate("/recipes") : setIsEditing(false)}
						disabled={saving}
					>
						Cancel
					</Button>
				</div>
			</div>

			<AddIngredientDialog
				open={ingredientDialogOpen}
				onOpenChange={handleIngredientDialogOpenChange}
				onAdd={handleAddIngredient}
				preselectedItem={
					editingIngredientIndex !== null
						? allAvailableItems.find((i) => i._id === ingredients[editingIngredientIndex].ingredient.item)
						: undefined
				}
				preQuantity={
					editingIngredientIndex !== null
						? ingredients[editingIngredientIndex].ingredient.quantity
						: undefined
				}
				preUnit={
					editingIngredientIndex !== null && ingredients[editingIngredientIndex].ingredient.unit
						? ingredients[editingIngredientIndex].ingredient.unit
						: undefined
				}
			/>
		</div>
	);
};

export default RecipeForm;
