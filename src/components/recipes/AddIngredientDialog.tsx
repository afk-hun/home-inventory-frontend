import { IIngredient } from "@/model/recipe";
import ItemQuantityDialog from "@/components/ItemQuantityDialog";

interface AddIngredientDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: (ingredient: IIngredient, itemName: string) => void;
}

const AddIngredientDialog = ({ open, onOpenChange, onAdd }: AddIngredientDialogProps) => {
	return (
		<ItemQuantityDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Add Ingredient"
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
