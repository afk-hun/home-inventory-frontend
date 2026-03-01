import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Household = {
	id: string;
	name: string;
	members: string[];
	inviteEmail: string;
};

const initialHouseholds: Household[] = [
	{
		id: "household-1",
		name: "Main Household",
		members: ["owner@example.com", "partner@example.com"],
		inviteEmail: "",
	},
];

const createHousehold = (index: number): Household => ({
	id: `household-${Date.now()}-${index}`,
	name: `New Household ${index}`,
	members: [],
	inviteEmail: "",
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HouseholdSettingsSection = () => {
	const [households, setHouseholds] = useState<Household[]>(initialHouseholds);

	const updateHousehold = (
		householdId: string,
		updater: (household: Household) => Household,
	) => {
		setHouseholds((prev) =>
			prev.map((household) =>
				household.id === householdId ? updater(household) : household,
			),
		);
	};

	const handleAddHousehold = () => {
		setHouseholds((prev) => [
			...prev,
			createHousehold(prev.length + 1),
		]);
	};

	const handleDeleteHousehold = (householdId: string) => {
		setHouseholds((prev) => prev.filter((household) => household.id !== householdId));
	};

	const handleInviteMember = (householdId: string) => {
		const household = households.find((item) => item.id === householdId);
		if (!household) {
			return;
		}

		const trimmedEmail = household.inviteEmail.trim().toLowerCase();
		if (!emailPattern.test(trimmedEmail)) {
			return;
		}

		if (household.members.includes(trimmedEmail)) {
			updateHousehold(householdId, (item) => ({ ...item, inviteEmail: "" }));
			return;
		}

		updateHousehold(householdId, (item) => ({
			...item,
			members: [...item.members, trimmedEmail],
			inviteEmail: "",
		}));
	};

	const handleRemoveMember = (householdId: string, memberEmail: string) => {
		updateHousehold(householdId, (household) => ({
			...household,
			members: household.members.filter((member) => member !== memberEmail),
		}));
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h3 className="text-sm font-medium">Households</h3>
					<p className="text-muted-foreground text-xs">
						Manage multiple households and members.
					</p>
				</div>
				<Button type="button" variant="outline" onClick={handleAddHousehold}>
					Add household
				</Button>
			</div>

			{households.length === 0 && (
				<div className="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
					No households yet. Add a new household to get started.
				</div>
			)}

			{households.map((household) => (
				<Card key={household.id} className="gap-4 py-4">
					<CardHeader className="px-4">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<CardTitle className="text-base">{household.name}</CardTitle>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								onClick={() => handleDeleteHousehold(household.id)}
							>
								Delete household
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-4 px-4">
						<div className="space-y-2">
							<Label htmlFor={`household-name-${household.id}`}>Household name</Label>
							<Input
								id={`household-name-${household.id}`}
								value={household.name}
								onChange={(event) =>
									updateHousehold(household.id, (item) => ({
										...item,
										name: event.target.value,
									}))
								}
								placeholder="Household name"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor={`invite-member-${household.id}`}>Invite user by email</Label>
							<div className="flex flex-col gap-2 sm:flex-row">
								<Input
									id={`invite-member-${household.id}`}
									type="email"
									value={household.inviteEmail}
									onChange={(event) =>
										updateHousehold(household.id, (item) => ({
											...item,
											inviteEmail: event.target.value,
										}))
									}
									placeholder="new-member@example.com"
								/>
								<Button
									type="button"
									variant="secondary"
									onClick={() => handleInviteMember(household.id)}
								>
									Invite
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Members</Label>
							{household.members.length === 0 ? (
								<p className="text-muted-foreground text-sm">No invited members yet.</p>
							) : (
								<ul className="space-y-2">
									{household.members.map((memberEmail) => (
										<li
											key={`${household.id}-${memberEmail}`}
											className="flex items-center justify-between gap-3 rounded-md border p-2"
										>
											<span className="text-sm">{memberEmail}</span>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													handleRemoveMember(household.id, memberEmail)
												}
											>
												Delete user
											</Button>
										</li>
									))}
								</ul>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default HouseholdSettingsSection;