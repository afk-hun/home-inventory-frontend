export interface IShoppingListItem {
	itemName: string;
	quantity: number;
	unit: string;
}

export interface IShoppingList {
	_id: string;
	householdId: string;
	name: string;
	storeId: string;
	items: IShoppingListItem[];
}
