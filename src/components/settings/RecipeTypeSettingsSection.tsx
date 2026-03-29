import { useEffect, useState } from "react";
import { IRecipeType } from "@/model/recipeType";
import {
	fetchRecipeTypes,
	createRecipeType,
	renameRecipeType,
	deleteRecipeType,
} from "@/api/recipeType";
import EditableList from "@/components/EditableList";

const RecipeTypeSettingsSection = () => {
	const [recipeTypes, setRecipeTypes] = useState<IRecipeType[]>([]);

	useEffect(() => {
		fetchRecipeTypes()
			.then((data) => setRecipeTypes(data))
			.catch((err) => console.error("Error fetching recipe types:", err));
	}, []);

	const handleCreate = (name: string): Promise<void> => {
		return createRecipeType(name).then((created) => {
			setRecipeTypes((prev) => [...prev, created]);
		});
	};

	const handleSave = (id: string, name: string): Promise<void> => {
		return renameRecipeType(id, name).then(() => {
			setRecipeTypes((prev) =>
				prev.map((item) => (item._id === id ? { ...item, name } : item)),
			);
		});
	};

	const handleDelete = (id: string): Promise<void> => {
		return deleteRecipeType(id).then(() => {
			setRecipeTypes((prev) => prev.filter((item) => item._id !== id));
		});
	};

	return (
		<EditableList
			items={recipeTypes}
			onCreate={handleCreate}
			onSave={handleSave}
			onDelete={handleDelete}
			addPlaceholder="New recipe type name"
		/>
	);
};

export default RecipeTypeSettingsSection;
