import { useEffect, useState } from "react";
import { Pencil, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { IItem, IConnectedStore } from "@/model/item";
import { IItemType } from "@/model/itemType";
import { IStore } from "@/model/store";
import { IInvoiceItemRecord } from "@/model/invoiceItem";
import { updateItem, deleteItem, toggleFavoriteItem } from "@/api/item";
import { fetchInvoiceItems } from "@/api/invoiceItem";

interface ItemListElementProps {
	item: IItem;
	itemTypes: IItemType[];
	stores: IStore[];
	onUpdated: (updated: IItem) => void;
	onFavoriteChanged: (itemId: string, isFavorite: boolean) => void;
	onDeleted: (itemId: string) => void;
}

const ItemListElement = ({
	item,
	itemTypes,
	stores,
	onUpdated,
	onFavoriteChanged,
	onDeleted,
}: ItemListElementProps) => {
	const [editOpen, setEditOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [favoriteSaving, setFavoriteSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Edit form state
	const [editName, setEditName] = useState(item.name);
	const [editType, setEditType] = useState<string>(item.type?._id ?? "");
	const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
	// Maps storeId → { storeItemId, storeItemName } for the save payload
	const [storeItemDataMap, setStoreItemDataMap] = useState<
		Map<string, { storeItemId: string; storeItemName: string }>
	>(new Map());

	// Invoice items multi-select
	const [invoiceItems, setInvoiceItems] = useState<IInvoiceItemRecord[]>([]);
	const [invoiceItemsLoading, setInvoiceItemsLoading] = useState(false);
	const [selectedInvoiceItemIds, setSelectedInvoiceItemIds] = useState<string[]>([]);
	const [invoiceSearch, setInvoiceSearch] = useState("");
	const [invoiceFocused, setInvoiceFocused] = useState(false);

	const openEdit = () => {
		setEditName(item.name);
		setEditType(item.type?._id ?? "");
		setError(null);

		// Pre-populate store selections and item data from existing connectedStores
		setSelectedStoreIds(item.connectedStores.map((cs) => cs.storeId));
		setStoreItemDataMap(
			new Map(
				item.connectedStores.map((cs) => [
					cs.storeId,
					{ storeItemId: cs.storeItemId, storeItemName: cs.storeItemName },
				]),
			),
		);

		setInvoiceItemsLoading(true);
		fetchInvoiceItems()
			.then((data) => {
				setInvoiceItems(data);
				// Pre-populate selected invoice items by matching storeItemId + storeId
				const preSelected = data
					.filter((ii) =>
						item.connectedStores.some(
							(cs) => cs.storeItemId === ii.inStoreId && cs.storeId === ii.store.id,
						),
					)
					.map((ii) => ii._id);
				setSelectedInvoiceItemIds(preSelected);
			})
			.catch((err: Error) => console.error(err))
			.finally(() => setInvoiceItemsLoading(false));

		setEditOpen(true);
	};

	// Clear invoice items when dialog closes
	useEffect(() => {
		if (!editOpen) {
			setSelectedInvoiceItemIds([]);
			setInvoiceItems([]);
			setInvoiceSearch("");
		}
	}, [editOpen]);

	const dropdownInvoiceItems = invoiceSearch.trim()
		? invoiceItems.filter(
				(ii) =>
					ii.inStoreName.toLowerCase().includes(invoiceSearch.toLowerCase()) &&
					!selectedInvoiceItemIds.includes(ii._id),
			)
		: [];

	const addInvoiceItem = (invoiceItemId: string) => {
		const invoiceItem = invoiceItems.find((ii) => ii._id === invoiceItemId);
		if (!invoiceItem) return;

		const matchingStore = stores.find((s) => s._id === invoiceItem.store.id);
		if (!matchingStore) return;

		const storeId = matchingStore._id;

		setSelectedInvoiceItemIds((prev) => [...prev, invoiceItemId]);

		setSelectedStoreIds((prev) =>
			prev.includes(storeId) ? prev : [...prev, storeId],
		);

		setStoreItemDataMap((prev) => {
			const next = new Map(prev);
			next.set(storeId, {
				storeItemId: invoiceItem.inStoreId,
				storeItemName: invoiceItem.inStoreName,
			});
			return next;
		});

		setInvoiceSearch("");
	};

	const toggleInvoiceItem = (invoiceItemId: string) => {
		const invoiceItem = invoiceItems.find((ii) => ii._id === invoiceItemId);
		if (!invoiceItem) return;

		const matchingStore = stores.find((s) => s._id === invoiceItem.store.id);
		if (!matchingStore) return;

		const storeId = matchingStore._id;
		const isSelected = selectedInvoiceItemIds.includes(invoiceItemId);

		if (isSelected) {
			// Deselect invoice item
			const remaining = selectedInvoiceItemIds.filter((id) => id !== invoiceItemId);
			setSelectedInvoiceItemIds(remaining);

			// Uncheck the store only if no other selected invoice item points to it
			// and it wasn't originally connected
			const otherInvoiceItemLinksStore = remaining.some((id) => {
				const ii = invoiceItems.find((x) => x._id === id);
				return ii && stores.find((s) => s._id === ii.store.id)?._id === storeId;
			});
			const wasOriginallyConnected = item.connectedStores.some(
				(cs) => cs.storeId === storeId,
			);

			if (!otherInvoiceItemLinksStore && !wasOriginallyConnected) {
				setSelectedStoreIds((prev) => prev.filter((id) => id !== storeId));
				setStoreItemDataMap((prev) => {
					const next = new Map(prev);
					next.delete(storeId);
					return next;
				});
			}
		} else {
			// Select invoice item → auto-check its store and store the item data
			setSelectedInvoiceItemIds((prev) => [...prev, invoiceItemId]);

			setSelectedStoreIds((prev) =>
				prev.includes(storeId) ? prev : [...prev, storeId],
			);

			setStoreItemDataMap((prev) => {
				const next = new Map(prev);
				next.set(storeId, {
					storeItemId: invoiceItem.inStoreId,
					storeItemName: invoiceItem.inStoreName,
				});
				return next;
			});
		}
	};

	const toggleStore = (storeId: string) => {
		setSelectedStoreIds((prev) =>
			prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId],
		);
	};

	const handleSave = () => {
		if (!editName.trim()) {
			setError("Item name is required.");
			return;
		}

		const newConnectedStores: IConnectedStore[] = selectedStoreIds.map((storeId) => {
			const data = storeItemDataMap.get(storeId);
			const store = stores.find((s) => s._id === storeId);
			return {
				storeId,
				storeName: store?.name ?? "",
				storeItemId: data?.storeItemId ?? "",
				storeItemName: data?.storeItemName ?? "",
			};
		});

		setSaving(true);
		setError(null);

		updateItem(item._id, {
			name: editName.trim(),
			...(editType ? { type: editType } : {}),
			connectedStores: newConnectedStores,
		})
			.then((updated) => {
				onUpdated(updated);
				setEditOpen(false);
			})
			.catch((err: Error) => {
				setError(err.message);
			})
			.finally(() => {
				setSaving(false);
			});
	};

	const handleDelete = () => {
		setDeleting(true);
		deleteItem(item._id)
			.then(() => {
				onDeleted(item._id);
			})
			.catch((err: Error) => {
				console.error(err);
			})
			.finally(() => {
				setDeleting(false);
			});
	};

	const handleFavoriteToggle = () => {
		setFavoriteSaving(true);
		setError(null);
		toggleFavoriteItem(item._id, Boolean(item.isFavorite))
			.then((isFavorite) => {
				onFavoriteChanged(item._id, isFavorite);
			})
			.catch((err: Error) => {
				setError(err.message);
			})
			.finally(() => {
				setFavoriteSaving(false);
			});
	};

	return (
		<>
			<div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3">
				<div className="flex min-w-0 flex-col gap-1">
					<span className="truncate font-medium">{item.name}</span>
					{item.type && (
						<span className="text-xs text-muted-foreground">{item.type.name}</span>
					)}
					{item.connectedStores.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{item.connectedStores.map((cs) => (
								<Badge key={cs.storeId} variant="outline" className="text-xs">
									{cs.storeName}
								</Badge>
							))}
						</div>
					)}
				</div>
				<div className="flex shrink-0 gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleFavoriteToggle}
						disabled={favoriteSaving || deleting}
						aria-label={item.isFavorite ? "Remove item from favorites" : "Add item to favorites"}
					>
						<Star className={item.isFavorite ? "h-4 w-4 fill-current text-amber-500" : "h-4 w-4"} />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={openEdit}
						disabled={deleting || favoriteSaving}
						aria-label="Edit item"
					>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={handleDelete}
						disabled={deleting || favoriteSaving}
						aria-label="Delete item"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</div>
			{error && !editOpen && <p className="px-1 text-sm text-destructive">{error}</p>}

			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Item</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						<div className="space-y-1">
							<Label htmlFor="item-name">Name</Label>
							<Input
								id="item-name"
								value={editName}
								onChange={(e) => setEditName(e.target.value)}
								placeholder="Item name"
							/>
						</div>

						<div className="space-y-1">
							<Label htmlFor="item-type">Item Type</Label>
							<Select value={editType} onValueChange={setEditType}>
								<SelectTrigger id="item-type">
									<SelectValue placeholder="Select type…" />
								</SelectTrigger>
								<SelectContent>
									{itemTypes.map((t) => (
										<SelectItem key={t._id} value={t._id}>
											{t.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label>Invoice Items</Label>
							{invoiceItemsLoading ? (
								<p className="text-muted-foreground text-sm">Loading…</p>
							) : invoiceItems.length === 0 ? (
								<p className="text-muted-foreground text-sm">No invoice items available.</p>
							) : (
								<>
									<div className="relative">
										<Input
											placeholder="Search invoice items…"
											value={invoiceSearch}
											onChange={(e) => setInvoiceSearch(e.target.value)}
											onFocus={() => setInvoiceFocused(true)}
											onBlur={() => setTimeout(() => setInvoiceFocused(false), 150)}
										/>
										{invoiceFocused && invoiceSearch.trim() && dropdownInvoiceItems.length > 0 && (
											<div className="absolute z-10 w-full rounded-md border bg-background shadow-md max-h-48 overflow-y-auto">
												{dropdownInvoiceItems.map((ii) => (
													<div
														key={ii._id}
														className="cursor-pointer px-3 py-2 text-sm hover:bg-accent"
														onClick={() => addInvoiceItem(ii._id)}
													>
														{ii.inStoreName}
														<span className="text-muted-foreground ml-1 text-xs">
															— {ii.store.name}
														</span>
													</div>
												))}
											</div>
										)}
									</div>
									{selectedInvoiceItemIds.length > 0 && (
										<div className="space-y-2">
											{selectedInvoiceItemIds.map((id) => {
												const ii = invoiceItems.find((x) => x._id === id);
												if (!ii) return null;
												return (
													<div key={ii._id} className="flex items-center gap-2">
														<Checkbox
															id={`invoice-item-${ii._id}`}
															checked
															onCheckedChange={() => toggleInvoiceItem(ii._id)}
														/>
														<label
															htmlFor={`invoice-item-${ii._id}`}
															className="cursor-pointer text-sm leading-tight"
														>
															{ii.inStoreName}
															<span className="text-muted-foreground ml-1 text-xs">
																— {ii.store.name}
															</span>
														</label>
													</div>
												);
											})}
										</div>
									)}
								</>
							)}
						</div>

						<div className="space-y-2">
							<Label>Shops</Label>
							{stores.length === 0 ? (
								<p className="text-muted-foreground text-sm">No shops available.</p>
							) : (
								<div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
									{stores.map((store) => (
										<div key={store._id} className="flex items-center gap-2">
											<Checkbox
												id={`store-${store._id}`}
												checked={selectedStoreIds.includes(store._id)}
												onCheckedChange={() => toggleStore(store._id)}
											/>
											<label
												htmlFor={`store-${store._id}`}
												className="cursor-pointer text-sm"
											>
												{store.name}
											</label>
										</div>
									))}
								</div>
							)}
						</div>

						{error && <p className="text-destructive text-sm">{error}</p>}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>
							Cancel
						</Button>
						<Button onClick={handleSave} disabled={saving}>
							{saving ? "Saving…" : "OK"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ItemListElement;
