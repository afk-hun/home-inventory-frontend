import { IIngredient } from "@/model/recipe";
import { IItem } from "@/model/item";
import ItemQuantityDialog from "@/components/ItemQuantityDialog";

interface AddIngredientDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: (ingredient: IIngredient, itemName: string) => void;
	preselectedItem?: IItem;
	preQuantity?: number;
	preUnit?: string;
	title?: string;
}

const AddIngredientDialog = ({
	open,
	onOpenChange,
	onAdd,
	preselectedItem,
	preQuantity,
	preUnit,
	title,
}: AddIngredientDialogProps) => {
	const isEditing = !!preselectedItem;
	const dialogTitle = title ?? (isEditing ? "Edit Ingredient" : "Add Ingredient");
	const submitLabel = isEditing ? "Save" : "Add";

	return (
		<ItemQuantityDialog
			open={open}
			onOpenChange={onOpenChange}
			title={dialogTitle}
			submitLabel={submitLabel}
			preselectedItem={preselectedItem}
			preQuantity={preQuantity}
			preUnit={preUnit}
			disableItemSelection={isEditing}
			onSubmit={({ item, quantity, unit }) => {
				onAdd(
					{ item: item._id, quantity, unit: unit ?? "" },
					item.name,
				);
			}}
		/>
	);
};

export default AddIngredientDialog;
