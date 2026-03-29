export interface IIngredient {
	_id?: string;
	item: string; // item _id
	quantity: number;
	unit: string;
}

export interface IRecipe {
	_id: string;
	householdId: string;
	name: string;
	type?: string;
	ingredients: IIngredient[];
	portion?: number;
	description?: string;
}
