import { useState } from "react";
import { Check, Pencil, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditableListItemProps {
	id: string;
	name: string;
	onSave: (id: string, newName: string) => void;
	onDelete: (id: string) => void;
}

const EditableListItem = ({ id, name, onSave, onDelete }: EditableListItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [value, setValue] = useState(name);

	const handleSave = () => {
		const trimmed = value.trim();
		if (trimmed && trimmed !== name) {
			onSave(id, trimmed);
		}
		setIsEditing(false);
	};

	const handleCancel = () => {
		setValue(name);
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") handleSave();
		if (e.key === "Escape") handleCancel();
	};

	return (
		<div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
			{isEditing ? (
				<>
					<Input
						className="h-7 flex-1"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={handleKeyDown}
						autoFocus
					/>
					<div className="flex shrink-0 gap-1">
						<Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave}>
							<Check className="h-4 w-4" />
						</Button>
						<Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancel}>
							<Undo2 className="h-4 w-4" />
						</Button>
					</div>
				</>
			) : (
				<>
					<span className="flex-1 text-sm">{name}</span>
					<div className="flex shrink-0 gap-1">
						<Button
							size="icon"
							variant="ghost"
							className="h-7 w-7"
							onClick={() => setIsEditing(true)}
						>
							<Pencil className="h-4 w-4" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							className="h-7 w-7 text-destructive hover:text-destructive"
							onClick={() => onDelete(id)}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

export default EditableListItem;
