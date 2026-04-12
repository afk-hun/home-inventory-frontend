import { useEffect, useState } from "react";

import { fetchItems } from "@/api/item";
import { IItem } from "@/model/item";
import { UNIT_GROUPS } from "@/lib/units";
import ItemSearchPicker from "@/components/ItemSearchPicker";
import ItemSettingsSection from "@/components/settings/ItemSettingsSection";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type ItemQuantityDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	submitLabel?: string;
	onSubmit: (payload: { item: IItem; quantity: number; unit?: string }) => Promise<void> | void;
};

const ItemQuantityDialog = ({
	open,
	onOpenChange,
	title,
	submitLabel = "Add",
	onSubmit,
}: ItemQuantityDialogProps) => {
	const [availableItems, setAvailableItems] = useState<IItem[]>([]);
	const [selectedItemId, setSelectedItemId] = useState<string>(NONE);
	const [quantity, setQuantity] = useState<string>("");
	const [unit, setUnit] = useState<string>(NONE);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [itemsDialogOpen, setItemsDialogOpen] = useState(false);

	useEffect(() => {
		fetchItems()
			.then(setAvailableItems)
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		if (!open) {
			return;
		}

		setSelectedItemId(NONE);
		setQuantity("");
		setUnit(NONE);
		setError(null);
		setSubmitting(false);
	}, [open]);

	const handleItemsDialogChange = (dialogOpen: boolean) => {
		setItemsDialogOpen(dialogOpen);
		if (!dialogOpen) {
			fetchItems()
				.then(setAvailableItems)
				.catch((err) => console.error(err));
		}
	};

	const handleSubmit = async () => {
		if (selectedItemId === NONE) {
			setError("Please select an item.");
			return;
		}

		const parsedQuantity = parseFloat(quantity);
		if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
			setError("Please enter a valid quantity.");
			return;
		}

		const item = availableItems.find((entry) => entry._id === selectedItemId);
		if (!item) {
			setError("Selected item was not found.");
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			await onSubmit({
				item,
				quantity: parsedQuantity,
				unit: unit === NONE ? undefined : unit,
			});
			onOpenChange(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Request failed.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent
					className="max-w-xs"
					onOpenAutoFocus={(event) => event.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 pt-1">
						<div className="space-y-1.5">
							<Label>Item</Label>
							<div className="flex gap-2">
								<ItemSearchPicker
									items={availableItems}
									value={selectedItemId}
									onValueChange={setSelectedItemId}
									emptyValue={NONE}
									placeholder="Type to find an item..."
									disabled={submitting}
									forceClosed={itemsDialogOpen}
									className="flex-1"
								/>
								<Button
									variant="outline"
									size="sm"
									className="shrink-0"
									onClick={() => setItemsDialogOpen(true)}
									disabled={submitting}
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
								disabled={submitting}
							/>
						</div>

						<div className="space-y-1.5">
							<Label>Unit</Label>
							<Select value={unit} onValueChange={setUnit} disabled={submitting}>
								<SelectTrigger>
									<SelectValue placeholder="—" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={NONE}>—</SelectItem>
									{UNIT_GROUPS.map((group) => (
										<SelectGroup key={group.label}>
											<SelectLabel>{group.label}</SelectLabel>
											{group.units.map((entry) => (
												<SelectItem key={entry} value={entry}>
													{entry}
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
						<Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
							Cancel
						</Button>
						<Button onClick={handleSubmit} disabled={submitting || selectedItemId === NONE}>
							{submitting ? `${submitLabel}ing...` : submitLabel}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={itemsDialogOpen} onOpenChange={handleItemsDialogChange}>
				<DialogContent className="max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
					<DialogHeader>
						<DialogTitle>Manage Items</DialogTitle>
					</DialogHeader>
					<div className="flex-1 overflow-y-auto min-h-0">
						<ItemSettingsSection />
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ItemQuantityDialog;