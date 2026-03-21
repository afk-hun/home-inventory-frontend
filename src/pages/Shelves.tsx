import { useState } from "react";

import ResourceSelectorHeader from "@/components/ResourceSelectorHeader";
import ShelfDetails from "@/components/shelves/ShelfDetails";
import ShelfItemList from "@/components/shelves/ShelfItemList";
import { fetchShelves, createShelf, deleteShelf, fetchShelf, removeShelfItem, addShelfItem } from "@/api/shelf";

const Shelves = () => {
	const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);
	const [selectedShelfName, setSelectedShelfName] = useState<string>("");
	const [itemListRefreshKey, setItemListRefreshKey] = useState(0);
	const [moveMode, setMoveMode] = useState(false);
	const [moveSelectedItems, setMoveSelectedItems] = useState<string[]>([]);

	const handleMoveStart = () => setMoveMode(true);

	const handleMoveCancel = () => {
		setMoveMode(false);
		setMoveSelectedItems([]);
	};

	const handleMoveConfirm = (targetShelfId: string) => {
		if (!selectedShelfId || !targetShelfId || moveSelectedItems.length === 0) return;
		fetchShelf(selectedShelfId)
			.then((shelf) => {
				const itemsToMove = shelf.items.filter((i) => moveSelectedItems.includes(i._id));
				return itemsToMove.reduce(
					(promise, item) =>
						promise
							.then(() => removeShelfItem(selectedShelfId, item._id))
							.then(() => addShelfItem(targetShelfId, item.item._id, item.itemName, item.quantity, item.unit)),
					Promise.resolve() as Promise<unknown>,
				);
			})
			.then(() => {
				setMoveMode(false);
				setMoveSelectedItems([]);
				setItemListRefreshKey((k) => k + 1);
			})
			.catch((err) => console.error(err));
	};

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold">Shelves</h1>
				<p className="text-muted-foreground text-sm">
					Manage your shelves and their contents.
				</p>
			</div>
			<ResourceSelectorHeader
				selectedId={selectedShelfId}
				onSelectionChange={(id, name) => {
					setSelectedShelfId(id || null);
					setSelectedShelfName(name || "");
					if (moveMode) handleMoveCancel();
				}}
				fetchItems={fetchShelves}
				createItem={createShelf}
				deleteItem={deleteShelf}
				entityLabel="shelf"
				inputPlaceholder="New shelf name"
			>
				<ShelfDetails
					shelfId={selectedShelfId}
					shelfName={selectedShelfName}
					onItemAdded={() => setItemListRefreshKey((k) => k + 1)}
					moveMode={moveMode}
					moveSelectedCount={moveSelectedItems.length}
					onMoveStart={handleMoveStart}
					onMoveCancel={handleMoveCancel}
					onMoveConfirm={handleMoveConfirm}
				/>
			</ResourceSelectorHeader>
			<ShelfItemList
				shelfId={selectedShelfId}
				refreshKey={itemListRefreshKey}
				moveMode={moveMode}
				onMoveSelectionChange={setMoveSelectedItems}
			/>
		</div>
	);
};

export default Shelves;
