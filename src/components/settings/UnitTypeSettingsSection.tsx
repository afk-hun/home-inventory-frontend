import { useEffect, useState } from "react";
import { IUnitType } from "@/model/unitType";
import {
	fetchUnitTypes,
	createUnitType,
	renameUnitType,
	deleteUnitType,
} from "@/api/unitType";
import EditableList from "@/components/EditableList";

const UnitTypeSettingsSection = () => {
	const [unitTypes, setUnitTypes] = useState<IUnitType[]>([]);

	useEffect(() => {
		fetchUnitTypes()
			.then((data) => setUnitTypes(data))
			.catch((err) => console.error("Error fetching unit types:", err));
	}, []);

	const handleCreate = (name: string): Promise<void> => {
		return createUnitType(name).then((created) => {
			setUnitTypes((prev) => [...prev, created]);
		});
	};

	const handleSave = (id: string, name: string): Promise<void> => {
		return renameUnitType(id, name).then(() => {
			setUnitTypes((prev) =>
				prev.map((item) => (item._id === id ? { ...item, name } : item)),
			);
		});
	};

	const handleDelete = (id: string): Promise<void> => {
		return deleteUnitType(id).then(() => {
			setUnitTypes((prev) => prev.filter((item) => item._id !== id));
		});
	};

	return (
		<EditableList
			items={unitTypes}
			onCreate={handleCreate}
			onSave={handleSave}
			onDelete={handleDelete}
			addPlaceholder="New unit name"
		/>
	);
};

export default UnitTypeSettingsSection;
