import { useEffect, useState } from "react";
import {
	createHousehold,
	fetchHouseholds,
	removeHousehold,
	renameHousehold,
} from "@/api/household";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHousehold } from "@/contexts/household-context";

const HouseholdSettingsSection = () => {
	const {
		households,
		setHouseholds,
		addHousehold,
		updateHousehold,
		deleteHousehold,
	} = useHousehold();

	const [newHouseholdName, setNewHouseholdName] = useState('');

	useEffect(() => {
		fetchHouseholds()
			.then((households) => {
				setHouseholds(households);
				console.log("Fetched households:", households);
			})
			.catch((err) => {
				console.error("Error fetching households:", err);
			});
	}, []);

	const handleAddHousehold = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (newHouseholdName.trim() === "") return;	

		createHousehold(newHouseholdName)
			.then((household) => {
				addHousehold(household);
				setNewHouseholdName("");
			})
			.catch((err) => {
				console.error("Error adding household:", err);
			});
	};

	const handleDeleteHousehold = (householdId: string) => {
		console.log("Deleting household with ID:", householdId);
		removeHousehold(householdId)
			.then(() => {
				deleteHousehold(householdId);
			})
			.catch((err) => {
				console.error("Error deleting household:", err);
			});
	};

	const updateHouseholdName = (householdId: string, newName: string) => {
		renameHousehold(householdId, newName).then(() => {
			// updateHousehold(householdId, (household) => ({
			// 	...household,
			// 	name: updatedHousehold.name,
			// }));
		}).catch((err) => {
			console.error("Error renaming household:", err);
		});
		
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h3 className="text-sm font-medium">Households</h3>
					<p className="text-muted-foreground text-xs">
						Manage multiple households and members.
					</p>
				</div>
				<form className="flex gap-3" onSubmit={handleAddHousehold}>
					<Input
						type="text"
						name="householdName"
						id="householdName"
						placeholder="New household name"
						className="mr-2"
						value={newHouseholdName}
						onChange={(e) => setNewHouseholdName(e.target.value)}
					/>
					<Button
						type="submit"
						variant="outline"
						disabled={newHouseholdName.trim() === ""}
					>
						Add household
					</Button>
				</form>
			</div>

			{households.length === 0 && (
				<div className="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
					No households yet. Add a new household to get started.
				</div>
			)}

			{households.map((household) => (
				<Card key={household._id} className="gap-4 py-4">
					<CardHeader className="px-4">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<CardTitle className="text-base">
								{household.name}
							</CardTitle>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								onClick={() =>
									handleDeleteHousehold(household._id)
								}
							>
								Delete household
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-4 px-4">
						<div className="space-y-2">
							<Label htmlFor={`household-name-${household._id}`} >
								Household name
							</Label>
							<Input
								id={`household-name-${household._id}`}
								value={household.name}
								onChange={(event) =>
									updateHousehold(household._id, (item) => ({
										...item,
										name: event.target.value,
									}))
								}
								onBlur={(e) => updateHouseholdName(household._id, e.currentTarget.value)}
								placeholder="Household name"
							/>
							
						</div>

						<div className="space-y-2">
							<Label htmlFor={`invite-member-${household._id}`}>
								Invite user by email
							</Label>
							<div className="flex flex-col gap-2 sm:flex-row">
								<Input
									id={`invite-member-${household._id}`}
									type="email"
									// value={household.inviteEmail}
									onChange={(event) =>
										updateHousehold(
											household._id,
											(item) => ({
												...item,
												inviteEmail: event.target.value,
											}),
										)
									}
									placeholder="new-member@example.com"
								/>
								<Button
									disabled
									type="button"
									variant="secondary"
									onClick={
										() => {}
										// handleInviteMember(household.id)
									}
								>
									Invite
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Members</Label>
							{household.members.length === 0 ? (
								<p className="text-muted-foreground text-sm">
									No invited members yet.
								</p>
							) : (
								<ul className="space-y-2">
									{household.members.map((member) => (
										<li
											key={`${household._id}-${member._id}`}
											className="flex items-center justify-between gap-3 rounded-md border p-2"
										>
											<span className="text-sm">
												{member.name} ({member.email})
											</span>
											<Button
												disabled
												type="button"
												variant="outline"
												size="sm"
												onClick={
													() => {}
													// handleRemoveMember(
													// 	household.id,
													// 	memberEmail,
													// )
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
