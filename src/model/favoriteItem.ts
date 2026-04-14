import { IItemType } from "@/model/item";

export interface IFavoriteItem {
	_id: string;
	householdId: string;
	name: string;
	type: IItemType | null;
	isFavorite: boolean;
	quantity: number | null;
	unit: string | null;
	isAvailable: boolean;
}