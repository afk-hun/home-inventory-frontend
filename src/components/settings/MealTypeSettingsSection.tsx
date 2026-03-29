import { useEffect, useState } from "react";
import { IMealType } from "@/model/mealType";
import {
	fetchMealTypes,
	createMealType,
	renameMealType,
	deleteMealType,
} from "@/api/mealType";
import EditableList from "@/components/EditableList";

const MealTypeSettingsSection = () => {
	const [mealTypes, setMealTypes] = useState<IMealType[]>([]);

	useEffect(() => {
		fetchMealTypes()
			.then((data) => setMealTypes(data))
			.catch((err) => console.error("Error fetching meal types:", err));
	}, []);

	const handleCreate = (name: string): Promise<void> => {
		return createMealType(name).then((created) => {
			setMealTypes((prev) => [...prev, created]);
		});
	};

	const handleSave = (id: string, name: string): Promise<void> => {
		return renameMealType(id, name).then(() => {
			setMealTypes((prev) =>
				prev.map((item) => (item._id === id ? { ...item, name } : item)),
			);
		});
	};

	const handleDelete = (id: string): Promise<void> => {
		return deleteMealType(id).then(() => {
			setMealTypes((prev) => prev.filter((item) => item._id !== id));
		});
	};

	return (
		<EditableList
			items={mealTypes}
			onCreate={handleCreate}
			onSave={handleSave}
			onDelete={handleDelete}
			addPlaceholder="New meal type name"
		/>
	);
};

export default MealTypeSettingsSection;
