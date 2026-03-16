import { useEffect, useState } from "react";
import { IShelfType } from "@/model/shelfType";
import {
	fetchShelfTypes,
	createShelfType,
	renameShelfType,
	deleteShelfType,
} from "@/api/shelfType";
import EditableList from "@/components/EditableList";

const ShelfTypeSettingsSection = () => {
	const [shelfTypes, setShelfTypes] = useState<IShelfType[]>([]);

	useEffect(() => {
		fetchShelfTypes()
			.then((data) => setShelfTypes(data))
			.catch((err) => console.error("Error fetching shelf types:", err));
	}, []);

	const handleCreate = (name: string): Promise<void> => {
		return createShelfType(name).then((created) => {
			setShelfTypes((prev) => [...prev, created]);
		});
	};

	const handleSave = (id: string, name: string): Promise<void> => {
		return renameShelfType(id, name).then(() => {
			setShelfTypes((prev) =>
				prev.map((item) => (item._id === id ? { ...item, name } : item)),
			);
		});
	};

	const handleDelete = (id: string): Promise<void> => {
		return deleteShelfType(id).then(() => {
			setShelfTypes((prev) => prev.filter((item) => item._id !== id));
		});
	};

	return (
		<EditableList
			items={shelfTypes}
			onCreate={handleCreate}
			onSave={handleSave}
			onDelete={handleDelete}
			addPlaceholder="New shelf type name"
		/>
	);
};

export default ShelfTypeSettingsSection;
