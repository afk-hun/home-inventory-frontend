export interface UnitGroup {
	label: string;
	units: string[];
}

export const UNIT_GROUPS: UnitGroup[] = [
	{
		label: "Mass",
		units: ["mg", "g", "dkg", "kg", "oz", "lb"],
	},
	{
		label: "Volume",
		units: ["ml", "cl", "dl", "l", "tsp", "tbsp", "fl_oz", "cup"],
	},
	{
		label: "Count",
		units: ["pc", "dozen"],
	},
	{
		label: "Other",
		units: ["bunch", "slice", "pinch", "bag", "handful", "pack"],
	},
];

export const ALL_UNITS: string[] = UNIT_GROUPS.flatMap((g) => g.units);
