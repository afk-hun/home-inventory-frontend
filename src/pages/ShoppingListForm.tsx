import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Trash2 } from "lucide-react";

import { IShoppingListItem } from "@/model/shoppingList";
import { IItem } from "@/model/item";
import { IStore } from "@/model/store";
import { IUnitType } from "@/model/unitType";
import { fetchShoppingList, createShoppingList, updateShoppingList } from "@/api/shoppingList";
import { fetchItems } from "@/api/item";
import { fetchStores } from "@/api/store";
import { fetchUnitTypes } from "@/api/unitType";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const NONE = "__none__";

interface EditableItem extends IShoppingListItem {
	_key: number;
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
	const [unitTypes, setUnitTypes] = useState<IUnitType[]>([]);

	const [selectedItemId, setSelectedItemId] = useState<string>(NONE);

	const [loading, setLoading] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchItems()
			.then(setAvailableItems)
			.catch((err) => console.error(err));
		fetchStores()
			.then(setStores)
			.catch((err) => console.error(err));
		fetchUnitTypes()
			.then(setUnitTypes)
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		setError(null);
		fetchShoppingList(id)
			.then((list) => {
				setName(list.name);
				setStoreId(list.storeId || NONE);
				setItems(list.items.map((item) => ({ ...item, _key: nextKey() })));
			})
			.catch((err: Error) => setError(err.message))
			.finally(() => setLoading(false));
	}, [id]);

	const handleAddItem = (itemId: string) => {
		if (itemId === NONE) return;
		const found = availableItems.find((i) => i._id === itemId);
		if (!found) return;
		setItems((prev) => [
			...prev,
			{ itemName: found.name, quantity: 1, unit: "", _key: nextKey() },
		]);
		setSelectedItemId(NONE);
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
				i._key === key ? { ...i, unit: value === NONE ? "" : value } : i,
			),
		);
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
			items: items.map(({ itemName, quantity, unit }) => ({ itemName, quantity, unit })),
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
					<Select value={storeId} onValueChange={setStoreId} disabled={saving}>
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

				{/* Item selector */}
				<div className="space-y-1.5">
					<Label>Add Item</Label>
					<Select
						value={selectedItemId}
						onValueChange={(val) => {
							setSelectedItemId(val);
							handleAddItem(val);
						}}
						disabled={saving}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select an item to add…" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={NONE}>—</SelectItem>
							{availableItems.map((item) => (
								<SelectItem key={item._id} value={item._id}>
									{item.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
							{items.map((item) => (
								<li
									key={item._key}
									className="flex items-center gap-3 px-3 py-2"
								>
									{/* Item name */}
									<span className="min-w-0 flex-1 truncate text-sm font-medium">
										{item.itemName}
									</span>

									{/* Quantity */}
									<Input
										type="number"
										min="0"
										step="any"
										value={item.quantity === 0 ? "" : item.quantity}
										onChange={(e) =>
											handleQuantityChange(item._key, e.target.value)
										}
										className="w-20 shrink-0"
										disabled={saving}
									/>

									{/* Unit */}
									<Select
										value={item.unit === "" ? NONE : item.unit}
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
											{unitTypes.map((u) => (
												<SelectItem key={u._id} value={u.name}>
													{u.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									{/* Remove */}
									<Button
										variant="ghost"
										size="sm"
										className="h-7 w-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
										onClick={() => handleRemoveItem(item._key)}
										disabled={saving}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
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
						onClick={() => navigate("/shopping-lists")}
						disabled={saving}
					>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ShoppingListForm;
