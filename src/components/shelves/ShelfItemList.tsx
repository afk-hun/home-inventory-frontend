import { useState, useEffect } from "react";
import { Pencil, Trash2, Check, Undo2 } from "lucide-react";

import { IShelfItem } from "@/model/shelf";
import { IUnitType } from "@/model/unitType";
import { fetchShelf, addShelfItem, removeShelfItem } from "@/api/shelf";
import { fetchUnitTypes } from "@/api/unitType";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const NONE = "__none__";

interface ShelfItemListProps {
	shelfId: string | null;
	refreshKey?: number;
	moveMode?: boolean;
	onMoveSelectionChange?: (selectedIds: string[]) => void;
}

const ShelfItemList = ({ shelfId, refreshKey, moveMode = false, onMoveSelectionChange }: ShelfItemListProps) => {
	const [items, setItems] = useState<IShelfItem[]>([]);
	const [unitTypes, setUnitTypes] = useState<IUnitType[]>([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editQuantity, setEditQuantity] = useState<string>("");
	const [editUnit, setEditUnit] = useState<string>(NONE);
	const [moveSelectedIds, setMoveSelectedIds] = useState<string[]>([]);

	useEffect(() => {
		fetchUnitTypes()
			.then(setUnitTypes)
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		if (!shelfId) {
			setItems([]);
			setEditingId(null);
			return;
		}
		setLoading(true);
		setError(null);
		fetchShelf(shelfId)
			.then((shelf) => setItems(shelf.items))
			.catch((err: Error) => setError(err.message))
			.finally(() => setLoading(false));
	}, [shelfId, refreshKey]);

	useEffect(() => {
		setMoveSelectedIds([]);
		onMoveSelectionChange?.([]);
	}, [moveMode]);

	const toggleMoveItem = (itemId: string) => {
		setMoveSelectedIds((prev) => {
			const next = prev.includes(itemId)
				? prev.filter((id) => id !== itemId)
				: [...prev, itemId];
			onMoveSelectionChange?.(next);
			return next;
		});
	};

	const startEdit = (item: IShelfItem) => {
		setEditingId(item._id);
		setEditQuantity(String(item.quantity));
		setEditUnit(item.unit || NONE);
	};

	const cancelEdit = () => setEditingId(null);

	const handleSave = (item: IShelfItem) => {
		if (!shelfId) return;
		const qty = parseFloat(editQuantity);
		if (isNaN(qty) || qty <= 0) return;
		const unit = editUnit === NONE ? undefined : editUnit;
		setSaving(true);
		setError(null);
		removeShelfItem(shelfId, item._id)
			.then(() => addShelfItem(shelfId, item.item._id, item.itemName, qty, unit))
			.then(() => fetchShelf(shelfId))
			.then((shelf) => {
				setItems(shelf.items);
				setEditingId(null);
			})
			.catch((err: Error) => setError(err.message))
			.finally(() => setSaving(false));
	};

	const handleDelete = (shelfItemId: string) => {
		if (!shelfId) return;
		setLoading(true);
		setError(null);
		removeShelfItem(shelfId, shelfItemId)
			.then(() =>
				setItems((prev) => prev.filter((i) => i._id !== shelfItemId)),
			)
			.catch((err: Error) => setError(err.message))
			.finally(() => setLoading(false));
	};

	if (!shelfId) return null;

	return (
		<div className="mt-6">
			<h2 className="mb-3 text-sm font-medium text-muted-foreground">Items</h2>
			{loading && (
				<p className="text-sm text-muted-foreground">Loading…</p>
			)}
			{error && <p className="text-sm text-destructive">{error}</p>}
			{!loading && items.length === 0 && (
				<p className="text-sm italic text-muted-foreground">
					No items on this shelf.
				</p>
			)}
			<div className="space-y-0.5">
				{items.map((item) => {
					const displayName = item.itemName || item.item.name;
					const isEditing = editingId === item._id;
					return (
						<div
							key={item._id}
							className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted/50"
						>
							<span className="flex-1 text-sm">{displayName}</span>
							{isEditing ? (
								<>
									<Input
										type="number"
										value={editQuantity}
										onChange={(e) => setEditQuantity(e.target.value)}
										className="h-7 w-20 text-sm"
										disabled={saving}
									/>
									<Select
										value={editUnit}
										onValueChange={setEditUnit}
										disabled={saving}
									>
										<SelectTrigger className="h-7 w-28 text-sm">
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
									<Button
										variant="ghost"
										size="sm"
										className="h-7 w-7 p-0"
										onClick={() => handleSave(item)}
										disabled={saving}
									>
										<Check className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-7 w-7 p-0 text-muted-foreground"
										onClick={cancelEdit}
										disabled={saving}
									>
										<Undo2 className="h-4 w-4" />
									</Button>
								</>
							) : (
								<>
									<span className="w-12 text-right text-sm text-muted-foreground">
										{item.quantity}
									</span>
									<span className="w-20 text-sm text-muted-foreground">
										{item.unit || "—"}
									</span>
									{!moveMode && (
										<>
											<Button
												variant="ghost"
												size="sm"
												className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
												onClick={() => startEdit(item)}
												disabled={loading}
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
												onClick={() => handleDelete(item._id)}
												disabled={loading}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</>
									)}
									{moveMode && (
										<Checkbox
											checked={moveSelectedIds.includes(item._id)}
											onCheckedChange={() => toggleMoveItem(item._id)}
										/>
									)}
								</>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ShelfItemList;
