
import { IHousehold } from "@/model/household";
import React, { createContext } from "react";

type HouseholdContextType = {
	households: IHousehold[];
	setHouseholds: React.Dispatch<React.SetStateAction<IHousehold[]>>;
	addHousehold: (household: IHousehold) => void;
	updateHousehold: (
		householdId: string,
		updater: (household: IHousehold) => IHousehold,
	) => void;
	deleteHousehold: (householdId: string) => void;
	activeHouseholdId: string | null;
	setActiveHouseholdId: React.Dispatch<React.SetStateAction<string | null>>;
};

export const HouseholdContext = createContext<HouseholdContextType>({
	households: [],
	setHouseholds: () => {},
	addHousehold: () => {},
	updateHousehold: () => {},
	deleteHousehold: () => {},
	activeHouseholdId: null,
	setActiveHouseholdId: () => {},
});

export const HouseholdProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [households, setHouseholds] = React.useState<IHousehold[]>([]);
	const [activeHouseholdId, setActiveHouseholdId] = React.useState<string | null>(null);

	return (
		<HouseholdContext.Provider
			value={{
				households,
				setHouseholds,
				addHousehold: (household) => {
					setHouseholds((prev) => [...prev, household]);
				},
				updateHousehold: (householdId, updater) => {
					setHouseholds((prev) =>
						prev.map((household) =>
							household._id === householdId
								? updater(household)
								: household,
						),
					);
				},
				deleteHousehold: (householdId) => {
					setHouseholds((prev) =>
						prev.filter(
							(household) => household._id !== householdId,
						),
					);
				},
				activeHouseholdId,
				setActiveHouseholdId,
			}}
		>
			{children}
		</HouseholdContext.Provider>
	);
};

export const useHousehold = () => React.useContext(HouseholdContext);
