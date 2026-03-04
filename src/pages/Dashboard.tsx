import { fetchHouseholds } from "@/api/household";
import { useHousehold } from "@/contexts/household-context";
import { useEffect } from "react";

function Dashboard() {
	const { setHouseholds } = useHousehold();

	useEffect(() => {
		fetchHouseholds()
			.then((households) => {
				setHouseholds(households);
			})
			.catch((err) => {
				console.error("Error fetching households:", err);
			});
	}, []);

	return (
		<main className="app">
			<h1>Home Inventory</h1>
			<p>Vite + React + TypeScript is ready.</p>
		</main>
	);
}

export default Dashboard;
