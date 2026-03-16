import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EditableListItem from "@/components/EditableListItem";

interface EditableListItem {
	_id: string;
	name: string;
}

interface EditableListProps {
	items: EditableListItem[];
	onSave: (id: string, name: string) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
	onCreate: (name: string) => Promise<void>;
	addPlaceholder?: string;
}

const EditableList = ({
	items,
	onSave,
	onDelete,
	onCreate,
	addPlaceholder = "New item name",
}: EditableListProps) => {
	const [newName, setNewName] = useState("");

	const handleCreate = () => {
		const trimmed = newName.trim();
		if (!trimmed) return;
		onCreate(trimmed)
			.then(() => setNewName(""))
			.catch((err) => console.error("Error creating item:", err));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") handleCreate();
	};

	return (
		<div className="space-y-2">
			<div className="flex gap-2">
				<Input
					placeholder={addPlaceholder}
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<Button
					type="button"
					variant="outline"
					size="icon"
					disabled={newName.trim() === ""}
					onClick={handleCreate}
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>

			{items.length === 0 ? (
				<div className="text-muted-foreground rounded-md border border-dashed p-4 text-center text-sm">
					No items yet. Add one above.
				</div>
			) : (
				<div className="space-y-1">
					{items.map((item) => (
						<EditableListItem
							key={item._id}
							id={item._id}
							name={item.name}
							onSave={(id, name) => {
								onSave(id, name).catch((err) =>
									console.error("Error saving item:", err),
								);
							}}
							onDelete={(id) => {
								onDelete(id).catch((err) =>
									console.error("Error deleting item:", err),
								);
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default EditableList;
