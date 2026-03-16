import { useEffect, useState } from "react";
import { IShelfPlaceType } from "@/model/shelfPlaceType";
import {
	fetchShelfPlaceTypes,
	createShelfPlaceType,
	renameShelfPlaceType,
	deleteShelfPlaceType,
} from "@/api/shelfPlaceType";
import EditableList from "@/components/EditableList";

const ShelfPlaceTypeSettingsSection = () => {
	const [shelfPlaceTypes, setShelfPlaceTypes] = useState<IShelfPlaceType[]>([]);

	useEffect(() => {
		fetchShelfPlaceTypes()
			.then((data) => setShelfPlaceTypes(data))
			.catch((err) => console.error("Error fetching shelf place types:", err));
	}, []);

	const handleCreate = (name: string): Promise<void> => {
		return createShelfPlaceType(name).then((created) => {
			setShelfPlaceTypes((prev) => [...prev, created]);
		});
	};

	const handleSave = (id: string, name: string): Promise<void> => {
		return renameShelfPlaceType(id, name).then(() => {
			setShelfPlaceTypes((prev) =>
				prev.map((item) => (item._id === id ? { ...item, name } : item)),
			);
		});
	};

	const handleDelete = (id: string): Promise<void> => {
		return deleteShelfPlaceType(id).then(() => {
			setShelfPlaceTypes((prev) => prev.filter((item) => item._id !== id));
		});
	};

	return (
		<EditableList
			items={shelfPlaceTypes}
			onCreate={handleCreate}
			onSave={handleSave}
			onDelete={handleDelete}
			addPlaceholder="New shelf place name"
		/>
	);
};

export default ShelfPlaceTypeSettingsSection;
