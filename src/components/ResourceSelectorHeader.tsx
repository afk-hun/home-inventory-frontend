import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ResourceItem {
	_id: string;
	name: string;
}

interface ResourceSelectorHeaderProps {
	selectedId: string | null;
	onSelectionChange: (id: string) => void;
	fetchItems: () => Promise<ResourceItem[]>;
	createItem: (name: string) => Promise<ResourceItem>;
	deleteItem: (id: string) => Promise<void>;
	entityLabel: string;
	inputPlaceholder?: string;
	children?: React.ReactNode;
}

const ResourceSelectorHeader = ({
	selectedId,
	onSelectionChange,
	fetchItems,
	createItem,
	deleteItem,
	entityLabel,
	inputPlaceholder,
	children,
}: ResourceSelectorHeaderProps) => {
	const [items, setItems] = useState<ResourceItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [newName, setNewName] = useState<string>("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		fetchItems()
			.then((data) => {
				setItems(data);
				if (data.length > 0 && !selectedId) {
					onSelectionChange(data[0]._id);
				}
			})
			.catch((err) => {
				console.error(`Failed to fetch ${entityLabel}s:`, err);
				setError(`Failed to load ${entityLabel}s.`);
			})
			.finally(() => setLoading(false));
	}, []);

	const selectedItem = items.find((item) => item._id === selectedId) ?? null;

	const handleDelete = () => {
		if (!selectedId) return;
		setLoading(true);
		setError(null);
		deleteItem(selectedId)
			.then(() => {
				const remaining = items.filter((item) => item._id !== selectedId);
				setItems(remaining);
				if (remaining.length > 0) {
					onSelectionChange(remaining[0]._id);
				} else {
					onSelectionChange("");
				}
			})
			.catch((err) => {
				console.error(`Failed to delete ${entityLabel}:`, err);
				setError(`Failed to delete ${entityLabel}.`);
			})
			.finally(() => {
				setLoading(false);
				setDeleteDialogOpen(false);
			});
	};

	const handleAdd = () => {
		const trimmed = newName.trim();
		if (!trimmed) return;
		setLoading(true);
		setError(null);
		createItem(trimmed)
			.then((created) => {
				setItems((prev) => [...prev, created]);
				onSelectionChange(created._id);
				setNewName("");
			})
			.catch((err) => {
				console.error(`Failed to create ${entityLabel}:`, err);
				setError(`Failed to add ${entityLabel}.`);
			})
			.finally(() => setLoading(false));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") handleAdd();
	};

	return (
		<div className="w-full space-y-4 pb-4 border-b">
			<div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row">
				{/* Left side */}
				<div className="flex items-center gap-2">
					{items.length === 0 && !loading ? (
						<p className="text-muted-foreground text-sm">
							You don&apos;t have any {entityLabel}, please add one.
						</p>
					) : (
						<>
							<Select
								value={selectedId ?? ""}
								onValueChange={onSelectionChange}
								disabled={loading}
							>
								<SelectTrigger className="w-48">
									<SelectValue placeholder={`Select a ${entityLabel}`} />
								</SelectTrigger>
								<SelectContent>
									{items.map((item) => (
										<SelectItem key={item._id} value={item._id}>
											{item.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								variant="destructive"
								size="sm"
								disabled={loading || !selectedId}
								onClick={() => setDeleteDialogOpen(true)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</>
					)}
					{error && <p className="text-destructive text-sm">{error}</p>}
				</div>

				{/* Right side */}
				<div className="flex items-center gap-2">
					<Input
						placeholder={inputPlaceholder ?? `New ${entityLabel} name`}
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						onKeyDown={handleKeyDown}
						className="w-48"
						disabled={loading}
					/>
					<Button
						size="sm"
						disabled={loading || !newName.trim()}
						onClick={handleAdd}
					>
						+
					</Button>
				</div>
			</div>

			{children}

			{/* Delete confirmation dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete {entityLabel}</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure to delete{" "}
							<strong>{selectedItem?.name ?? "this"}</strong> {entityLabel}?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={loading}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default ResourceSelectorHeader;
