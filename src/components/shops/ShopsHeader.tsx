import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

import { IStore } from "@/model/store";
import { fetchStores, createStore, deleteStore } from "@/api/store";
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

interface ShopsHeaderProps {
	selectedStoreId: string | null;
	onStoreChange: (storeId: string) => void;
}

const ShopsHeader = ({ selectedStoreId, onStoreChange }: ShopsHeaderProps) => {
	const [stores, setStores] = useState<IStore[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [newShopName, setNewShopName] = useState<string>("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		fetchStores()
			.then((data) => {
				setStores(data);
				if (data.length > 0 && !selectedStoreId) {
					onStoreChange(data[0]._id);
				}
			})
			.catch((err) => {
				console.error("Failed to fetch stores:", err);
				setError("Failed to load shops.");
			})
			.finally(() => setLoading(false));
	}, []);

	const selectedStore = stores.find((s) => s._id === selectedStoreId) ?? null;

	const handleDelete = () => {
		if (!selectedStoreId) return;
		setLoading(true);
		setError(null);
		deleteStore(selectedStoreId)
			.then(() => {
				const remaining = stores.filter((s) => s._id !== selectedStoreId);
				setStores(remaining);
				if (remaining.length > 0) {
					onStoreChange(remaining[0]._id);
				} else {
					onStoreChange("");
				}
			})
			.catch((err) => {
				console.error("Failed to delete store:", err);
				setError("Failed to delete shop.");
			})
			.finally(() => {
				setLoading(false);
				setDeleteDialogOpen(false);
			});
	};

	const handleAdd = () => {
		const trimmed = newShopName.trim();
		if (!trimmed) return;
		setLoading(true);
		setError(null);
		createStore(trimmed)
			.then((store) => {
				setStores((prev) => [...prev, store]);
				onStoreChange(store._id);
				setNewShopName("");
			})
			.catch((err) => {
				console.error("Failed to create store:", err);
				setError("Failed to add shop.");
			})
			.finally(() => setLoading(false));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") handleAdd();
	};

	return (
		<div className="flex items-center justify-between gap-4 p-4 border-b">
			{/* Left side */}
			<div className="flex items-center gap-2">
				{stores.length === 0 && !loading ? (
					<p className="text-sm text-muted-foreground">
						You don&apos;t have any shop, please add one.
					</p>
				) : (
					<>
						<Select
							value={selectedStoreId ?? ""}
							onValueChange={onStoreChange}
							disabled={loading}
						>
							<SelectTrigger className="w-48">
								<SelectValue placeholder="Select a shop" />
							</SelectTrigger>
							<SelectContent>
								{stores.map((store) => (
									<SelectItem key={store._id} value={store._id}>
										{store.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							variant="destructive"
							size="sm"
							disabled={loading || !selectedStoreId}
							onClick={() => setDeleteDialogOpen(true)}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</>
				)}
				{error && <p className="text-sm text-destructive">{error}</p>}
			</div>

			{/* Right side */}
			<div className="flex items-center gap-2">
				<Input
					placeholder="New shop name"
					value={newShopName}
					onChange={(e) => setNewShopName(e.target.value)}
					onKeyDown={handleKeyDown}
					className="w-48"
					disabled={loading}
				/>
				<Button
					size="sm"
					disabled={loading || !newShopName.trim()}
					onClick={handleAdd}
				>
					+
				</Button>
			</div>

			{/* Delete confirmation dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete shop</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure to delete{" "}
							<strong>{selectedStore?.name ?? "this"}</strong> shop?
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

export default ShopsHeader;
