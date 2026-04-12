import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Trash2, ShoppingCart } from "lucide-react";

import { IShoppingListItem } from "@/model/shoppingList";
import { IItem } from "@/model/item";
import { IRecipe } from "@/model/recipe";
import { IStore } from "@/model/store";
import {
	fetchShoppingList,
	createShoppingList,
	updateShoppingList,
} from "@/api/shoppingList";
import { addCheckedToShoppingBag } from "@/api/shelf";
import { fetchItemsByStore } from "@/api/item";
import { fetchRecipes, fetchMissingIngredients } from "@/api/recipe";
import { fetchStores } from "@/api/store";
import { UNIT_GROUPS } from "@/lib/units";
import ItemSearchPicker from "@/components/ItemSearchPicker";
import ItemSettingsSection from "@/components/settings/ItemSettingsSection";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const NONE = "__none__";

interface EditableItem extends IShoppingListItem {
	_key: number;
	checked: boolean;
}

let keyCounter = 0;
const nextKey = () => ++keyCounter;

const ShoppingListForm = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id?: string }>();
	const isNew = !id;

	const [name, setName] = useState<string>("");
	const [storeId, setStoreId] = useState<string>(NONE);
	const [items, setItems] = useState<EditableItem[]>([]);

	const [availableItems, setAvailableItems] = useState<IItem[]>([]);
	const [stores, setStores] = useState<IStore[]>([]);

	const [selectedItemId, setSelectedItemId] = useState<string>(NONE);

	const [recipes, setRecipes] = useState<IRecipe[]>([]);
	const [selectedRecipeId, setSelectedRecipeId] = useState<string>(NONE);
	const [importing, setImporting] = useState<boolean>(false);

	const [loading, setLoading] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const [addingToBag, setAddingToBag] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [itemsDialogOpen, setItemsDialogOpen] = useState<boolean>(false);

	const checkedCount = items.filter((i) => i.checked).length;

	useEffect(() => {
		fetchStores()
			.then(setStores)
			.catch((err) => console.error(err));
		fetchRecipes()
			.then(setRecipes)
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		if (storeId === NONE) {
			setAvailableItems([]);
			setSelectedItemId(NONE);
			return;
		}
		fetchItemsByStore(storeId)
			.then(setAvailableItems)
			.catch((err) => console.error(err));
	}, [storeId]);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		setError(null);
		fetchShoppingList(id)
			.then((list) => {
				setName(list.name);
				setStoreId(list.storeId || NONE);
				setItems(
					list.items.map((item) => ({ ...item, _key: nextKey() })),
				);
			})
			.catch((err: Error) => setError(err.message))
			.finally(() => setLoading(false));
	}, [id]);

	const handleImportRecipe = () => {
		if (selectedRecipeId === NONE) return;
		setImporting(true);
		setError(null);
		fetchMissingIngredients(selectedRecipeId)
			.then((missing) => {
				setItems((prev) => [
					...prev,
					...missing.map((m) => ({
						itemName: m.item.name,
						quantity: m.amount,
						unit: m.unit,
						_key: nextKey(),
						checked: false,
					})),
				]);
				setSelectedRecipeId(NONE);
			})
			.catch((err: Error) => setError(err.message))
			.finally(() => setImporting(false));
	};

	const handleAddItem = (itemId: string) => {
		if (itemId === NONE) return;
		const found = availableItems.find((i) => i._id === itemId);
		if (!found) return;
		setItems((prev) => [
			...prev,
			{
				itemName: found.name,
				quantity: 1,
				unit: "",
				_key: nextKey(),
				checked: false,
			},
		]);
		setSelectedItemId(NONE);
	};

	const handleItemsDialogChange = (dialogOpen: boolean) => {
		setItemsDialogOpen(dialogOpen);
		if (!dialogOpen && storeId !== NONE) {
			fetchItemsByStore(storeId)
				.then(setAvailableItems)
				.catch((err) => console.error(err));
		}
	};

	const handleRemoveItem = (key: number) => {
		setItems((prev) => prev.filter((i) => i._key !== key));
	};

	const handleQuantityChange = (key: number, value: string) => {
		setItems((prev) =>
			prev.map((i) =>
				i._key === key ? { ...i, quantity: parseFloat(value) || 0 } : i,
			),
		);
	};

	const handleUnitChange = (key: number, value: string) => {
		setItems((prev) =>
			prev.map((i) =>
				i._key === key
					? { ...i, unit: value === NONE ? "" : value }
					: i,
			),
		);
	};

	const handleToggleChecked = (key: number) => {
		setItems((prev) => {
			const updated = prev.map((i) =>
				i._key === key ? { ...i, checked: !i.checked } : i,
			);
			const unchecked = updated.filter((i) => !i.checked);
			const checked = updated.filter((i) => i.checked);
			const reordered = [...unchecked, ...checked];

			if (!isNew && id) {
				updateShoppingList(id, {
					items: reordered.map(
						({ itemName, quantity, unit, checked }) => ({
							itemName,
							quantity,
							unit,
							checked,
						}),
					),
				}).catch((err: Error) => setError(err.message));
			}

			return reordered;
		});
	};

	const handleSave = () => {
		const trimmedName = name.trim();
		if (!trimmedName) {
			setError("Title is required.");
			return;
		}
		if (storeId === NONE) {
			setError("Please select a store.");
			return;
		}

		const payload = {
			name: trimmedName,
			storeId,
			items: items.map(({ itemName, quantity, unit, checked }) => ({
				itemName,
				quantity,
				unit,
				checked,
			})),
		};

		setSaving(true);
		setError(null);

		if (!isNew && id) {
			updateShoppingList(id, payload)
				.then(() => navigate("/shopping-lists"))
				.catch((err: Error) => setError(err.message))
				.finally(() => setSaving(false));
		} else {
			createShoppingList(payload)
				.then(() => navigate("/shopping-lists"))
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

	return (
		<>
			<div className="mx-auto w-full max-w-2xl px-4 py-8 md:py-10">
				<div className="mb-6 space-y-1">
					<h1 className="text-2xl font-semibold">
						{isNew ? "New Shopping List" : "Edit Shopping List"}
					</h1>
					<p className="text-muted-foreground text-sm">
						{isNew
							? "Fill in the details to create a new shopping list."
							: "Update the shopping list details below."}
					</p>
				</div>

				<div className="space-y-5">
					{/* Title */}
					<div className="space-y-1.5">
						<Label htmlFor="list-name">
							Title <span className="text-destructive">*</span>
						</Label>
						<Input
							id="list-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Weekly Groceries"
							disabled={saving}
						/>
					</div>

					{/* Store */}
					<div className="space-y-1.5">
						<Label>
							Store <span className="text-destructive">*</span>
						</Label>
						<Select
							value={storeId}
							onValueChange={setStoreId}
							disabled={saving}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a store" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NONE}>—</SelectItem>
								{stores.map((s) => (
									<SelectItem key={s._id} value={s._id}>
										{s.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Recipe import */}
					<div className="space-y-1.5">
						<Label>Import from Recipe</Label>
						<div className="flex gap-2">
							<Select
								value={selectedRecipeId}
								onValueChange={setSelectedRecipeId}
								disabled={saving || importing}
							>
								<SelectTrigger className="flex-1">
									<SelectValue placeholder="Select a recipe…" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={NONE}>—</SelectItem>
									{recipes.map((r) => (
										<SelectItem key={r._id} value={r._id}>
											{r.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								variant="outline"
								size="sm"
								className="shrink-0"
								onClick={handleImportRecipe}
								disabled={saving || importing || selectedRecipeId === NONE}
							>
								{importing ? "Importing…" : "Import"}
							</Button>
						</div>
					</div>

					{/* Item selector */}
					<div className="space-y-1.5">
						<Label>Add Item</Label>
						<div className="flex gap-2">
							<ItemSearchPicker
								items={availableItems}
								value={selectedItemId}
								onValueChange={(value) => {
									setSelectedItemId(value);
									handleAddItem(value);
								}}
								emptyValue={NONE}
								placeholder="Type to find an item..."
								emptyMessage="No matching items found for this store."
								disabled={saving || storeId === NONE}
								forceClosed={itemsDialogOpen}
								className="flex-1"
							/>
							<Button
								variant="outline"
								size="sm"
								className="shrink-0"
								onClick={() => setItemsDialogOpen(true)}
								disabled={saving}
							>
								New
							</Button>
						</div>
					</div>

					{/* Items list */}
					<div className="space-y-2">
						<Label>Items</Label>
						{items.length === 0 ? (
							<div className="text-muted-foreground rounded-md border border-dashed p-4 text-center text-sm">
								No items added yet.
							</div>
						) : (
							<ul className="divide-y rounded-md border">
								{[...items].sort((a, b) => a.itemName.localeCompare(b.itemName)).map((item) => (
									<li
										key={item._key}
										className="flex items-center gap-3 px-3 py-2"
									>
										{/* Checkbox */}
										<Checkbox
											checked={item.checked}
											onCheckedChange={() =>
												handleToggleChecked(item._key)
											}
											disabled={saving}
										/>

										{/* Item name */}
										<span
											className={`min-w-0 flex-1 truncate text-sm font-medium ${item.checked ? "text-muted-foreground line-through" : ""}`}
										>
											{item.itemName}
										</span>

										{/* Quantity */}
										<Input
											type="number"
											min="0"
											step="any"
											value={
												item.quantity === 0
													? ""
													: item.quantity
											}
											onChange={(e) =>
												handleQuantityChange(
													item._key,
													e.target.value,
												)
											}
											className="w-20 shrink-0"
											disabled={saving}
										/>

										{/* Unit */}
										<Select
											value={
												item.unit === ""
													? NONE
													: item.unit
											}
											onValueChange={(val) =>
												handleUnitChange(item._key, val)
											}
											disabled={saving}
										>
											<SelectTrigger className="w-28 shrink-0">
												<SelectValue placeholder="—" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value={NONE}>—</SelectItem>
												{UNIT_GROUPS.map((group) => (
													<SelectGroup key={group.label}>
														<SelectLabel>{group.label}</SelectLabel>
														{group.units.map((u) => (
															<SelectItem key={u} value={u}>
																{u}
															</SelectItem>
														))}
													</SelectGroup>
												))}
											</SelectContent>
										</Select>

										{/* Remove */}
										<Button
											variant="ghost"
											size="sm"
											className="h-7 w-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
											onClick={() =>
												handleRemoveItem(item._key)
											}
											disabled={saving}
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</li>
								))}
							</ul>
						)}
					</div>

					{error && (
						<p className="text-destructive text-sm">{error}</p>
					)}

					{!isNew && (
						<Button
							variant="outline"
							onClick={() => {
								if (!id) return;
								setAddingToBag(true);
								setError(null);
								addCheckedToShoppingBag(id)
									.then(() =>
										fetchShoppingList(id).then((list) =>
											setItems(list.items.map((item) => ({ ...item, _key: nextKey() }))),
										),
									)
									.catch((err: Error) => setError(err.message))
									.finally(() => setAddingToBag(false));
							}}
							disabled={checkedCount === 0 || addingToBag || saving}
							className="w-full"
						>
							<ShoppingCart className="h-4 w-4" />
							{addingToBag ? "Moving…" : `Add checked items to shopping bag (${checkedCount})`}
						</Button>
					)}

					<div className="flex gap-3 pt-2">
						<Button onClick={handleSave} disabled={saving}>
							{saving ? "Saving…" : "Save"}
						</Button>
						<Button
							variant="outline"
							onClick={() => navigate("/shopping-lists")}
							disabled={saving}
						>
							Cancel
						</Button>
					</div>
				</div>
			</div>

			<Dialog
				open={itemsDialogOpen}
				onOpenChange={handleItemsDialogChange}
			>
				<DialogContent className="max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
					<DialogHeader>
						<DialogTitle>Manage Items</DialogTitle>
					</DialogHeader>
					<div className="flex-1 overflow-y-auto min-h-0">
						<ItemSettingsSection />
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ShoppingListForm;
