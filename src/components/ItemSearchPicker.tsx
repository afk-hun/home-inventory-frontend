import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchableEntity = {
	_id: string;
	name: string;
};

type ItemSearchPickerProps = {
	items: SearchableEntity[];
	value: string;
	onValueChange: (value: string) => void;
	emptyValue?: string;
	placeholder?: string;
	emptyMessage?: string;
	disabled?: boolean;
	forceClosed?: boolean;
	className?: string;
};

const ItemSearchPicker = ({
	items,
	value,
	onValueChange,
	emptyValue = "",
	placeholder = "Type to filter items...",
	emptyMessage = "No matching items found.",
	disabled = false,
	forceClosed = false,
	className,
}: ItemSearchPickerProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const lastCommittedLabelRef = useRef("");
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	const selectedItem = useMemo(
		() => items.find((item) => item._id === value) ?? null,
		[items, value],
	);

	const filteredItems = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) {
			return items;
		}

		return items.filter((item) => item.name.toLowerCase().includes(normalizedQuery));
	}, [items, query]);

	useEffect(() => {
		if (!value || value === emptyValue) {
			if (query === lastCommittedLabelRef.current) {
				setQuery("");
			}
			return;
		}

		if (selectedItem) {
			lastCommittedLabelRef.current = selectedItem.name;
			setQuery(selectedItem.name);
		}
	}, [emptyValue, query, selectedItem, value]);

	useEffect(() => {
		if (!open) {
			return;
		}

		const handlePointerDown = (event: MouseEvent) => {
			if (!containerRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handlePointerDown);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [open]);

	useEffect(() => {
		if (forceClosed) {
			setOpen(false);
		}
	}, [forceClosed]);

	const handleInputChange = (nextQuery: string) => {
		setQuery(nextQuery);
		if (forceClosed) {
			return;
		}
		setOpen(true);

		if (value !== emptyValue) {
			onValueChange(emptyValue);
		}
	};

	const handleSelect = (itemId: string) => {
		const selected = items.find((item) => item._id === itemId);
		if (selected) {
			lastCommittedLabelRef.current = selected.name;
			setQuery(selected.name);
		}
		onValueChange(itemId);
		setOpen(false);
	};

	return (
		<div ref={containerRef} className={cn("relative", className)}>
			<div className="relative">
				<Input
					value={query}
					onChange={(event) => handleInputChange(event.target.value)}
					onFocus={() => {
						if (!forceClosed) {
							setOpen(true);
						}
					}}
					placeholder={placeholder}
					disabled={disabled}
					className="pr-9"
				/>
				<ChevronsUpDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
			</div>

			{open && !disabled && !forceClosed && (
				<div className="bg-popover absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border shadow-md">
					{filteredItems.length === 0 ? (
						<div className="text-muted-foreground px-3 py-2 text-sm">{emptyMessage}</div>
					) : (
						<div className="p-1">
							{filteredItems.map((item) => {
								const isSelected = item._id === value;

								return (
									<Button
										key={item._id}
										type="button"
										variant="ghost"
										className="w-full justify-between px-2"
										onClick={() => handleSelect(item._id)}
									>
										<span className="truncate">{item.name}</span>
										<Check className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
									</Button>
								);
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default ItemSearchPicker;