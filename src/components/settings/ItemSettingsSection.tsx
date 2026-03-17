import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { IItem } from "@/model/item";
import { IItemType } from "@/model/itemType";
import { IStore } from "@/model/store";
import { fetchItems, createItem } from "@/api/item";
import { fetchItemTypes } from "@/api/itemType";
import { fetchStores } from "@/api/store";
import ItemListElement from "./ItemListElement";

const ItemSettingsSection = () => {
	const [items, setItems] = useState<IItem[]>([]);
	const [itemTypes, setItemTypes] = useState<IItemType[]>([]);
	const [stores, setStores] = useState<IStore[]>([]);
	const [loading, setLoading] = useState(false);
	const [newItemName, setNewItemName] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		Promise.all([fetchItems(), fetchItemTypes(), fetchStores()])
			.then(([itemsData, typesData, storesData]) => {
				setItems(itemsData);
				setItemTypes(typesData);
				setStores(storesData);
			})
			.catch((err: Error) => {
				console.error(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleCreate = () => {
		const name = newItemName.trim();
		if (!name) return;

		setLoading(true);
		setError(null);
		createItem(name)
			.then((created) => {
				setItems((prev) => [...prev, created]);
				setNewItemName("");
			})
			.catch((err: Error) => {
				setError(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleUpdated = (updated: IItem) => {
		setItems((prev) => prev.map((it) => (it._id === updated._id ? updated : it)));
	};

	const handleDeleted = (itemId: string) => {
		setItems((prev) => prev.filter((it) => it._id !== itemId));
	};

	return (
		<div className="space-y-4">
			<div className="flex gap-2">
				<Input
					placeholder="New item name"
					value={newItemName}
					onChange={(e) => setNewItemName(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleCreate()}
					disabled={loading}
				/>
				<Button onClick={handleCreate} disabled={loading || !newItemName.trim()}>
					+
				</Button>
			</div>

			{error && <p className="text-destructive text-sm">{error}</p>}

			{items.length === 0 && !loading ? (
				<div className="flex min-h-24 items-center justify-center rounded-md border border-dashed">
					<p className="text-muted-foreground text-sm">No items yet. Add one above.</p>
				</div>
			) : (
				<div className="space-y-2">
					{items.map((item) => (
						<ItemListElement
							key={item._id}
							item={item}
							itemTypes={itemTypes}
							stores={stores}
							onUpdated={handleUpdated}
							onDeleted={handleDeleted}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ItemSettingsSection;
