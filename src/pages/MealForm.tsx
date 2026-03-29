import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { fetchSchedule, updateSchedule } from "@/api/cookingSchedule";
import { fetchRecipes } from "@/api/recipe";
import { fetchMealTypes } from "@/api/mealType";
import { ICookingSchedule, IMeal } from "@/model/cookingSchedule";
import { IRecipe } from "@/model/recipe";
import { IMealType } from "@/model/mealType";

const MealForm = () => {
	const navigate = useNavigate();
	const { mealId } = useParams<{ mealId: string }>();
	const [searchParams] = useSearchParams();
	const scheduleId = searchParams.get("scheduleId") ?? "";
	const isEdit = !!mealId;

	const [schedule, setSchedule] = useState<ICookingSchedule | null>(null);
	const [recipes, setRecipes] = useState<IRecipe[]>([]);
	const [mealTypes, setMealTypes] = useState<IMealType[]>([]);

	const [recipeId, setRecipeId] = useState("");
	const [mealTypeId, setMealTypeId] = useState("");
	const [portion, setPortion] = useState(1);
	const [startDate, setStartDate] = useState(searchParams.get("start") ?? "");
	const [endDate, setEndDate] = useState(searchParams.get("end") ?? "");

	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetchRecipes().then(setRecipes).catch(console.error);
		fetchMealTypes().then(setMealTypes).catch(console.error);

		if (!scheduleId) return;

		fetchSchedule(scheduleId)
			.then((s) => {
				setSchedule(s);
				if (isEdit && mealId) {
					const meal = s.meals.find((m) => m._id === mealId);
					if (meal) {
						setRecipeId(meal.recipe);
						setMealTypeId(meal.mealType);
						setPortion(meal.portion);
						setStartDate(format(new Date(meal.start), "yyyy-MM-dd"));
						setEndDate(format(new Date(meal.end), "yyyy-MM-dd"));
					}
				}
			})
			.catch(console.error);
	}, [scheduleId, mealId, isEdit]);

	const handleSave = () => {
		if (!recipeId) { setError("Please select a recipe."); return; }
		if (!mealTypeId) { setError("Please select a meal type."); return; }
		if (!startDate || !endDate) { setError("Please fill in start and end dates."); return; }
		if (portion < 1) { setError("Portions must be at least 1."); return; }
		if (!schedule) { setError("Schedule not loaded. Try again."); return; }

		setError("");
		setSaving(true);

		const newMeal: IMeal = {
			...(isEdit && mealId ? { _id: mealId } : {}),
			recipe: recipeId,
			mealType: mealTypeId,
			portion,
			start: new Date(startDate).toISOString(),
			end: new Date(endDate).toISOString(),
		};

		const updatedMeals: IMeal[] = isEdit
			? schedule.meals.map((m) => (m._id === mealId ? newMeal : m))
			: [...schedule.meals, newMeal];

		updateSchedule(scheduleId, { meals: updatedMeals })
			.then(() => navigate("/meal-plans"))
			.catch((err: Error) => {
				setError(err.message ?? "Failed to save.");
				setSaving(false);
			});
	};

	return (
		<div className="mx-auto w-full max-w-xl px-4 py-8 md:py-10">
			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold">
					{isEdit ? "Edit Meal" : "Add Meal"}
				</h1>
				<p className="text-sm text-muted-foreground">
					{isEdit ? "Update this meal." : "Add a new meal to the schedule."}
				</p>
			</div>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle className="text-base">Meal details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-5">
					{/* Recipe */}
					<div className="space-y-2">
						<Label>Recipe</Label>
						<div className="flex gap-2">
							<Select value={recipeId} onValueChange={setRecipeId}>
								<SelectTrigger className="flex-1">
									<SelectValue placeholder="Select a recipe" />
								</SelectTrigger>
								<SelectContent>
									{recipes.map((r) => (
										<SelectItem key={r._id} value={r._id}>
											{r.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								variant="outline"
								type="button"
								onClick={() => navigate("/recipes/new")}
							>
								New recipe
							</Button>
						</div>
					</div>

					{/* Meal type */}
					<div className="space-y-2">
						<Label>Meal type</Label>
						<Select value={mealTypeId} onValueChange={setMealTypeId}>
							<SelectTrigger>
								<SelectValue placeholder="Select a meal type" />
							</SelectTrigger>
							<SelectContent>
								{mealTypes.map((m) => (
									<SelectItem key={m._id} value={m._id}>
										{m.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Portions */}
					<div className="space-y-2">
						<Label>Portions</Label>
						<Input
							type="number"
							min={1}
							value={portion}
							onChange={(e) => setPortion(Number(e.target.value))}
						/>
					</div>

					{/* Date range */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Start date</Label>
							<Input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label>End date</Label>
							<Input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>
					</div>

					{error && <p className="text-sm text-destructive">{error}</p>}

					<div className="flex gap-2 pt-2">
						<Button onClick={handleSave} disabled={saving}>
							{saving ? "Saving…" : "Save meal"}
						</Button>
						<Button
							variant="outline"
							onClick={() => navigate("/meal-plans")}
						>
							Cancel
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default MealForm;
