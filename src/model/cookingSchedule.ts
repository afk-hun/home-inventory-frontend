export interface IMeal {
	_id?: string;
	start: string;
	end: string;
	mealType: string;
	recipe: string;
	portion: number;
}

export interface ICookingSchedule {
	_id: string;
	householdId: string;
	name: string;
	start: string;
	end: string;
	meals: IMeal[];
}
