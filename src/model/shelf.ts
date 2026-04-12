export interface IShelfItem {
	_id: string;
	item: { _id: string; name: string; type?: { _id: string; name: string } | null };
	itemName?: string;
	quantity: number;
	unit?: string;
}

export interface IShelf {
	_id: string;
	householdId: string;
	name: string;
	place?: string;
	type?: string;
	items: IShelfItem[];
}
