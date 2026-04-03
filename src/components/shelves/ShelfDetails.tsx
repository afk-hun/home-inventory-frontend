import { useState, useEffect } from "react";
import { Settings2, Plus, ArrowRightLeft, Check, Undo2 } from "lucide-react";

import { IShelf } from "@/model/shelf";
import { IShelfType } from "@/model/shelfType";
import { IShelfPlaceType } from "@/model/shelfPlaceType";
import { IItem } from "@/model/item";
import { fetchShelfTypes } from "@/api/shelfType";
import { fetchShelfPlaceTypes } from "@/api/shelfPlaceType";
import { fetchItems } from "@/api/item";
import { fetchShelf, updateShelf, addShelfItem, fetchShelves } from "@/api/shelf";
import { UNIT_GROUPS } from "@/lib/units";
import ItemSettingsSection from "@/components/settings/ItemSettingsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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

interface ShelfDetailsProps {
	shelfId: string | null;
	shelfName?: string;
	onItemAdded?: () => void;
	moveMode?: boolean;
	moveSelectedCount?: number;
	onMoveStart?: () => void;
	onMoveCancel?: () => void;
	onMoveConfirm?: (targetShelfId: string) => void;
}

const ShelfDetails = ({
	shelfId,
	shelfName,
	onItemAdded,
	moveMode = false,
	moveSelectedCount = 0,
	onMoveStart,
	onMoveCancel,
	onMoveConfirm,
}: ShelfDetailsProps) => {
	// Properties state
	const [shelfTypes, setShelfTypes] = useState<IShelfType[]>([]);
	const [placeTypes, setPlaceTypes] = useState<IShelfPlaceType[]>([]);
	const [name, setName] = useState<string>("");
	const [type, setType] = useState<string>(NONE);
	const [place, setPlace] = useState<string>(NONE);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	// Add item state
	const [availableItems, setAvailableItems] = useState<IItem[]>([]);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [selectedItemId, setSelectedItemId] = useState<string>(NONE);
	const [addQuantity, setAddQuantity] = useState<string>("");
	const [addUnit, setAddUnit] = useState<string>(NONE);
	const [adding, setAdding] = useState(false);
	const [addError, setAddError] = useState<string | null>(null);
	const [itemsDialogOpen, setItemsDialogOpen] = useState(false);

	// Move mode state
	const [shelves, setShelves] = useState<IShelf[]>([]);
	const [moveTarget, setMoveTarget] = useState<string>(NONE);
	const [loadingShelves, setLoadingShelves] = useState(false);

	useEffect(() => {
		fetchShelfTypes()
			.then(setShelfTypes)
			.catch((err) => console.error(err));
		fetchShelfPlaceTypes()
			.then(setPlaceTypes)
			.catch((err) => console.error(err));
		fetchItems()
			.then(setAvailableItems)
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		if (!shelfId) {
			setName("");
			setType(NONE);
			setPlace(NONE);
			return;
		}
		setName(shelfName || "");
		setLoading(true);
		setError(null);
		fetchShelf(shelfId)
			.then((shelf) => {
				setName(shelf.name);
				setType(shelf.type || NONE);
				setPlace(shelf.place || NONE);
			})
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}, [shelfId]);

	useEffect(() => {
		if (moveMode) {
			setMoveTarget(NONE);
			setLoadingShelves(true);
			fetchShelves()
				.then((all) => setShelves(all.filter((s) => s._id !== shelfId)))
				.catch((err) => console.error(err))
				.finally(() => setLoadingShelves(false));
		} else {
			setShelves([]);
			setMoveTarget(NONE);
		}
	}, [moveMode, shelfId]);

	const save = (updates: { name?: string; type?: string; place?: string }) => {
		if (!shelfId) return;
		setSaving(true);
		setError(null);
		updateShelf(shelfId, updates)
			.catch((err: Error) => setError(err.message))
			.finally(() => setSaving(false));
	};

	const handleTypeChange = (value: string) => {
		setType(value);
		save({ type: value === NONE ? "" : value, place: place === NONE ? "" : place });
	};

	const handlePlaceChange = (value: string) => {
		setPlace(value);
		save({ type: type === NONE ? "" : type, place: value === NONE ? "" : value });
	};

	const handleNameSave = () => {
		const trimmed = name.trim();
		if (!trimmed || !shelfId) return;
		save({ name: trimmed });
	};

	const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") handleNameSave();
	};

	const handleItemsDialogChange = (open: boolean) => {
		setItemsDialogOpen(open);
		if (!open) {
			fetchItems()
				.then(setAvailableItems)
				.catch((err) => console.error(err));
		}
	};

	const openAddDialog = () => {
		setSelectedItemId(NONE);
		setAddQuantity("");
		setAddUnit(NONE);
		setAddError(null);
		setAddDialogOpen(true);
	};

	const handleAdd = () => {
		if (!shelfId || selectedItemId === NONE) return;
		const qty = parseFloat(addQuantity);
		if (isNaN(qty) || qty <= 0) {
			setAddError("Please enter a valid quantity.");
			return;
		}
		const item = availableItems.find((i) => i._id === selectedItemId);
		if (!item) return;
		const unit = addUnit === NONE ? undefined : addUnit;
		setAdding(true);
		setAddError(null);
		addShelfItem(shelfId, item._id, item.name, qty, unit)
			.then(() => {
				setAddDialogOpen(false);
				onItemAdded?.();
			})
			.catch((err: Error) => setAddError(err.message))
			.finally(() => setAdding(false));
	};

	if (!shelfId) return null;

	const displayType = type !== NONE ? type : null;
	const displayPlace = place !== NONE ? place : null;

	return (
		<>
			<div className="flex items-center gap-3">
				{loading ? (
					<span className="text-muted-foreground text-xs">Loading…</span>
				) : (
					<>
						{displayType && (
							<span className="text-muted-foreground text-sm">
								<span className="font-medium text-foreground">{displayType}</span>
							</span>
						)}
						{displayType && displayPlace && (
							<span className="text-muted-foreground text-xs">·</span>
						)}
						{displayPlace && (
							<span className="text-muted-foreground text-sm">
								<span className="font-medium text-foreground">{displayPlace}</span>
							</span>
						)}
						{!displayType && !displayPlace && (
							<span className="text-muted-foreground text-xs italic">No type or place set</span>
						)}
					</>
				)}
				{!moveMode && (
					<>
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
							onClick={() => setDialogOpen(true)}
						>
							<Settings2 className="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
							onClick={openAddDialog}
						>
							<Plus className="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
							onClick={onMoveStart}
						>
							<ArrowRightLeft className="h-3.5 w-3.5" />
						</Button>
					</>
				)}
				{moveMode && (
					<>
						<Select
							value={moveTarget}
							onValueChange={setMoveTarget}
							disabled={loadingShelves}
						>
							<SelectTrigger className="h-6 w-36 text-xs">
								<SelectValue placeholder={loadingShelves ? "Loading…" : "Select shelf"} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NONE}>—</SelectItem>
								{shelves.map((s) => (
									<SelectItem key={s._id} value={s._id}>
										{s.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
							onClick={() => onMoveConfirm?.(moveTarget)}
							disabled={moveTarget === NONE || moveSelectedCount === 0}
						>
							<Check className="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
							onClick={onMoveCancel}
						>
							<Undo2 className="h-3.5 w-3.5" />
						</Button>
					</>
				)}
			</div>

			{/* Properties dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-xs">
					<DialogHeader>
						<DialogTitle>Shelf Properties</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 pt-1">
						<div className="space-y-1.5">
							<Label>Name</Label>
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								onBlur={handleNameSave}
								onKeyDown={handleNameKeyDown}
								disabled={saving}
							/>
						</div>

						<div className="space-y-1.5">
							<Label>Type</Label>
							<Select
								value={type}
								onValueChange={handleTypeChange}
								disabled={saving}
							>
								<SelectTrigger>
									<SelectValue placeholder="—" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={NONE}>—</SelectItem>
									{shelfTypes.map((t) => (
										<SelectItem key={t._id} value={t.name}>
											{t.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1.5">
							<Label>Place</Label>
							<Select
								value={place}
								onValueChange={handlePlaceChange}
								disabled={saving}
							>
								<SelectTrigger>
									<SelectValue placeholder="—" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={NONE}>—</SelectItem>
									{placeTypes.map((p) => (
										<SelectItem key={p._id} value={p.name}>
											{p.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{saving && <p className="text-muted-foreground text-xs">Saving…</p>}
						{error && <p className="text-destructive text-xs">{error}</p>}
					</div>
				</DialogContent>
			</Dialog>

			{/* Add item dialog */}
			<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
				<DialogContent className="max-w-xs">
					<DialogHeader>
						<DialogTitle>Add Item to Shelf</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 pt-1">
						<div className="space-y-1.5">
							<Label>Item</Label>
							<div className="flex gap-2">
								<Select
									value={selectedItemId}
									onValueChange={setSelectedItemId}
									disabled={adding}
								>
									<SelectTrigger className="flex-1">
										<SelectValue placeholder="Select an item" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={NONE}>—</SelectItem>
										{availableItems.map((i) => (
											<SelectItem key={i._id} value={i._id}>
												{i.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button
									variant="outline"
									size="sm"
									className="shrink-0"
									onClick={() => setItemsDialogOpen(true)}
									disabled={adding}
								>
									New
								</Button>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label>Quantity</Label>
							<Input
								type="number"
								min="0"
								value={addQuantity}
								onChange={(e) => setAddQuantity(e.target.value)}
								disabled={adding}
							/>
						</div>

						<div className="space-y-1.5">
							<Label>Unit</Label>
							<Select
								value={addUnit}
								onValueChange={setAddUnit}
								disabled={adding}
							>
								<SelectTrigger>
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
						</div>

						{addError && <p className="text-destructive text-xs">{addError}</p>}
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setAddDialogOpen(false)}
							disabled={adding}
						>
							Cancel
						</Button>
						<Button
							onClick={handleAdd}
							disabled={adding || selectedItemId === NONE}
						>
							{adding ? "Adding…" : "Add"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

		{/* Items management dialog */}
		<Dialog open={itemsDialogOpen} onOpenChange={handleItemsDialogChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Manage Items</DialogTitle>
				</DialogHeader>
				<ItemSettingsSection />
			</DialogContent>
		</Dialog>
		</>
	);
};

export default ShelfDetails;
