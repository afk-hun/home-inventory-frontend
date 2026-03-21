import { useState } from "react";

import ResourceSelectorHeader from "@/components/ResourceSelectorHeader";
import ShelfDetails from "@/components/shelves/ShelfDetails";
import ShelfItemList from "@/components/shelves/ShelfItemList";
import { fetchShelves, createShelf, deleteShelf } from "@/api/shelf";

const Shelves = () => {
	const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);
	const [selectedShelfName, setSelectedShelfName] = useState<string>("");
	const [itemListRefreshKey, setItemListRefreshKey] = useState(0);

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
				/>
			</ResourceSelectorHeader>
			<ShelfItemList shelfId={selectedShelfId} refreshKey={itemListRefreshKey} />
		</div>
	);
};

export default Shelves;
