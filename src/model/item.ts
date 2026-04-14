export interface IConnectedStore {
	storeId: string;
	storeName: string;
	storeItemId: string;
	storeItemName: string;
}

export interface IItemType {
	_id: string;
	name: string;
}

export interface IItem {
	_id: string;
	householdId: string;
	name: string;
	type: IItemType | null;
	connectedStores: IConnectedStore[];
	isFavorite?: boolean;
}
