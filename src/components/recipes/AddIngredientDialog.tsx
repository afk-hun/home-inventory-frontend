import { useState, useEffect } from "react";

import { IItem } from "@/model/item";
import { IIngredient } from "@/model/recipe";
import { fetchItems } from "@/api/item";
import { UNIT_GROUPS } from "@/lib/units";
import ItemSettingsSection from "@/components/settings/ItemSettingsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const NONE = "__none__";

interface AddIngredientDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAdd: (ingredient: IIngredient, itemName: string) => void;
}

const AddIngredientDialog = ({ open, onOpenChange, onAdd }: AddIngredientDialogProps) => {
	const [availableItems, setAvailableItems] = useState<IItem[]>([]);
	const [selectedItemId, setSelectedItemId] = useState<string>(NONE);
	const [quantity, setQuantity] = useState<string>("");
	const [unit, setUnit] = useState<string>(NONE);
	const [error, setError] = useState<string | null>(null);
	const [itemsDialogOpen, setItemsDialogOpen] = useState<boolean>(false);

	useEffect(() => {
		fetchItems()
			.then(setAvailableItems)
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		if (open) {
			setSelectedItemId(NONE);
			setQuantity("");
			setUnit(NONE);
			setError(null);
		}
	}, [open]);

	const handleItemsDialogChange = (dialogOpen: boolean) => {
		setItemsDialogOpen(dialogOpen);
		if (!dialogOpen) {
			fetchItems()
				.then(setAvailableItems)
				.catch((err) => console.error(err));
		}
	};

	const handleAdd = () => {
		if (selectedItemId === NONE) {
			setError("Please select an item.");
			return;
		}
		const qty = parseFloat(quantity);
		if (isNaN(qty) || qty <= 0) {
			setError("Please enter a valid quantity.");
			return;
		}
		const item = availableItems.find((i) => i._id === selectedItemId);
		if (!item) return;
		const resolvedUnit = unit === NONE ? "" : unit;
		onAdd(
			{ item: item._id, quantity: qty, unit: resolvedUnit },
			item.name,
		);
		onOpenChange(false);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-xs">
					<DialogHeader>
						<DialogTitle>Add Ingredient</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 pt-1">
						<div className="space-y-1.5">
							<Label>Item</Label>
							<div className="flex gap-2">
								<Select
									value={selectedItemId}
									onValueChange={setSelectedItemId}
								>
									<SelectTrigger className="flex-1">
										<SelectValue placeholder="Select an item" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={NONE}>—</SelectItem>
										{availableItems.map((i) => (
											<SelectItem key={i._id} value={i._id}>
												{i.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button
									variant="outline"
									size="sm"
									className="shrink-0"
									onClick={() => setItemsDialogOpen(true)}
								>
									New
								</Button>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label>Quantity</Label>
							<Input
								type="number"
								min="0"
								value={quantity}
								onChange={(e) => setQuantity(e.target.value)}
							/>
						</div>

						<div className="space-y-1.5">
							<Label>Unit</Label>
							<Select value={unit} onValueChange={setUnit}>
								<SelectTrigger>
									<SelectValue placeholder="—" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={NONE}>—</SelectItem>
									{UNIT_GROUPS.map((group) => (
										<SelectGroup key={group.label}>
											<SelectLabel>{group.label}</SelectLabel>
											{group.units.map((u) => (
												<SelectItem key={u} value={u}>
													{u}
												</SelectItem>
											))}
										</SelectGroup>
									))}
								</SelectContent>
							</Select>
						</div>

						{error && <p className="text-destructive text-xs">{error}</p>}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button onClick={handleAdd} disabled={selectedItemId === NONE}>
							Add
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={itemsDialogOpen} onOpenChange={handleItemsDialogChange}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Manage Items</DialogTitle>
					</DialogHeader>
					<ItemSettingsSection />
				</DialogContent>
			</Dialog>
		</>
	);
};

export default AddIngredientDialog;
