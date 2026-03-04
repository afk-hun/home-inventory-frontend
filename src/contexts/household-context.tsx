
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
};

export const HouseholdContext = createContext<HouseholdContextType>({
	households: [],
	setHouseholds: () => {},
	addHousehold: () => {},
	updateHousehold: () => {},
	deleteHousehold: () => {},
});

export const HouseholdProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [households, setHouseholds] = React.useState<IHousehold[]>([]);

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
			}}
		>
			{children}
		</HouseholdContext.Provider>
	);
};

export const useHousehold = () => React.useContext(HouseholdContext);
