import { useEffect } from "react";
import { useHousehold } from "@/contexts/household-context";
import { setHousehold } from "@/api/household";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const HouseholdSelect = () => {
	const { households, activeHouseholdId, setActiveHouseholdId } = useHousehold();

	useEffect(() => {
		if (!activeHouseholdId && households.length > 0) {
			const firstId = households[0]._id;
			setActiveHouseholdId(firstId);
			setHousehold(firstId).catch((err) =>
				console.error("Error setting household:", err),
			);
		}
	}, [households, activeHouseholdId, setActiveHouseholdId]);

	const handleChange = (value: string) => {
		setActiveHouseholdId(value);
		setHousehold(value).catch((err) =>
			console.error("Error setting household:", err),
		);
	};

	if (households.length === 0) return null;

	return (
		<Select value={activeHouseholdId ?? ""} onValueChange={handleChange}>
			<SelectTrigger className="w-48">
				<SelectValue placeholder="Select household" />
			</SelectTrigger>
			<SelectContent>
				{households.map((h) => (
					<SelectItem key={h._id} value={h._id}>
						{h.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default HouseholdSelect;
