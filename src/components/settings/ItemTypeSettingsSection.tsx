import { useEffect, useState } from "react";
import { IItemType } from "@/model/itemType";
import {
	fetchItemTypes,
	createItemType,
	renameItemType,
	deleteItemType,
} from "@/api/itemType";
import EditableList from "@/components/EditableList";

const ItemTypeSettingsSection = () => {
	const [itemTypes, setItemTypes] = useState<IItemType[]>([]);

	useEffect(() => {
		fetchItemTypes()
			.then((data) => setItemTypes(data))
			.catch((err) => console.error("Error fetching item types:", err));
	}, []);

	const handleCreate = (name: string): Promise<void> => {
		return createItemType(name).then((created) => {
			setItemTypes((prev) => [...prev, created]);
		});
	};

	const handleSave = (id: string, name: string): Promise<void> => {
		return renameItemType(id, name).then(() => {
			setItemTypes((prev) =>
				prev.map((item) => (item._id === id ? { ...item, name } : item)),
			);
		});
	};

	const handleDelete = (id: string): Promise<void> => {
		return deleteItemType(id).then(() => {
			setItemTypes((prev) => prev.filter((item) => item._id !== id));
		});
	};

	return (
		<EditableList
			items={itemTypes}
			onCreate={handleCreate}
			onSave={handleSave}
			onDelete={handleDelete}
			addPlaceholder="New item type name"
		/>
	);
};

export default ItemTypeSettingsSection;
