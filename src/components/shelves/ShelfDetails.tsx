import { useState, useEffect } from "react";
import { Settings2 } from "lucide-react";

import { IShelfType } from "@/model/shelfType";
import { IShelfPlaceType } from "@/model/shelfPlaceType";
import { fetchShelfTypes } from "@/api/shelfType";
import { fetchShelfPlaceTypes } from "@/api/shelfPlaceType";
import { fetchShelf, updateShelf } from "@/api/shelf";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const NONE = "__none__";

interface ShelfDetailsProps {
	shelfId: string | null;
}

const ShelfDetails = ({ shelfId }: ShelfDetailsProps) => {
	const [shelfTypes, setShelfTypes] = useState<IShelfType[]>([]);
	const [placeTypes, setPlaceTypes] = useState<IShelfPlaceType[]>([]);
	const [type, setType] = useState<string>(NONE);
	const [place, setPlace] = useState<string>(NONE);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		fetchShelfTypes()
			.then(setShelfTypes)
			.catch((err) => console.error(err));
		fetchShelfPlaceTypes()
			.then(setPlaceTypes)
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		if (!shelfId) {
			setType(NONE);
			setPlace(NONE);
			return;
		}
		setLoading(true);
		setError(null);
		fetchShelf(shelfId)
			.then((shelf) => {
				setType(shelf.type || NONE);
				setPlace(shelf.place || NONE);
			})
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}, [shelfId]);

	const save = (newType: string, newPlace: string) => {
		if (!shelfId) return;
		setSaving(true);
		setError(null);
		updateShelf(shelfId, {
			type: newType === NONE ? "" : newType,
			place: newPlace === NONE ? "" : newPlace,
		})
			.catch((err: Error) => setError(err.message))
			.finally(() => setSaving(false));
	};

	const handleTypeChange = (value: string) => {
		setType(value);
		save(value, place);
	};

	const handlePlaceChange = (value: string) => {
		setPlace(value);
		save(type, value);
	};

	if (!shelfId) return null;

	const displayType = type !== NONE ? type : null;
	const displayPlace = place !== NONE ? place : null;

	return (
		<>
			<div className="flex items-center gap-3">
				{loading ? (
					<span className="text-muted-foreground text-xs">Loading…</span>
				) : (
					<>
						{displayType && (
							<span className="text-muted-foreground text-sm">
								<span className="font-medium text-foreground">{displayType}</span>
							</span>
						)}
						{displayType && displayPlace && (
							<span className="text-muted-foreground text-xs">·</span>
						)}
						{displayPlace && (
							<span className="text-muted-foreground text-sm">
								<span className="font-medium text-foreground">{displayPlace}</span>
							</span>
						)}
						{!displayType && !displayPlace && (
							<span className="text-muted-foreground text-xs italic">No type or place set</span>
						)}
					</>
				)}
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
					onClick={() => setDialogOpen(true)}
				>
					<Settings2 className="h-3.5 w-3.5" />
				</Button>
			</div>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-xs">
					<DialogHeader>
						<DialogTitle>Shelf Properties</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 pt-1">
						<div className="space-y-1.5">
							<Label>Type</Label>
							<Select
								value={type}
								onValueChange={handleTypeChange}
								disabled={saving}
							>
								<SelectTrigger>
									<SelectValue placeholder="—" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={NONE}>—</SelectItem>
									{shelfTypes.map((t) => (
										<SelectItem key={t._id} value={t.name}>
											{t.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1.5">
							<Label>Place</Label>
							<Select
								value={place}
								onValueChange={handlePlaceChange}
								disabled={saving}
							>
								<SelectTrigger>
									<SelectValue placeholder="—" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={NONE}>—</SelectItem>
									{placeTypes.map((p) => (
										<SelectItem key={p._id} value={p.name}>
											{p.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{saving && <p className="text-muted-foreground text-xs">Saving…</p>}
						{error && <p className="text-destructive text-xs">{error}</p>}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ShelfDetails;
