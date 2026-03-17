export interface IConnectedStore {
	storeId: string;
	storeName: string;
	storeItemId: string;
	storeItemName: string;
}

export interface IItem {
	_id: string;
	householdId: string;
	name: string;
	type: string | null;
	connectedStores: IConnectedStore[];
}
