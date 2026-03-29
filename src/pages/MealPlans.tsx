import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { format, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Pencil, BookOpen } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchSchedules, createSchedule } from "@/api/cookingSchedule";
import { fetchRecipes } from "@/api/recipe";
import { fetchMealTypes } from "@/api/mealType";
import { ICookingSchedule, IMeal } from "@/model/cookingSchedule";
import { IRecipe } from "@/model/recipe";
import { IMealType } from "@/model/mealType";

const MealPlans = () => {
	const navigate = useNavigate();
	const today = new Date();
	const [currentMonth, setCurrentMonth] = useState<Date>(
		new Date(today.getFullYear(), today.getMonth(), 1),
	);
	const [schedule, setSchedule] = useState<ICookingSchedule | null>(null);
	const [range, setRange] = useState<DateRange | undefined>();
	const [recipes, setRecipes] = useState<IRecipe[]>([]);
	const [mealTypes, setMealTypes] = useState<IMealType[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchRecipes().then(setRecipes).catch(console.error);
		fetchMealTypes().then(setMealTypes).catch(console.error);
	}, []);

	useEffect(() => {
		const monthName = format(currentMonth, "MMMM yyyy");
		setLoading(true);
		setRange(undefined);

		fetchSchedules()
			.then((schedules) => {
				const found = schedules.find((s) => s.name === monthName);
				if (found) {
					setSchedule(found);
					return;
				}
				return createSchedule({
					name: monthName,
					start: startOfMonth(currentMonth).toISOString(),
					end: endOfMonth(currentMonth).toISOString(),
				}).then(setSchedule);
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}, [currentMonth]);

	const recipeMap = Object.fromEntries(recipes.map((r) => [r._id, r.name]));
	const mealTypeMap = Object.fromEntries(mealTypes.map((m) => [m._id, m.name]));

	const displayedMeals: IMeal[] = (() => {
		if (!schedule) return [];
		if (!range?.from) return schedule.meals;
		const rangeFrom = range.from;
		const rangeTo = range.to ?? range.from;
		return schedule.meals.filter((meal) => {
			const mealStart = new Date(meal.start);
			const mealEnd = new Date(meal.end);
			return mealStart <= rangeTo && mealEnd >= rangeFrom;
		});
	})();

	const prevMonth = () =>
		setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));

	const nextMonth = () =>
		setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

	const handleAddMeal = () => {
		if (!schedule || !range?.from) return;
		const start = format(range.from, "yyyy-MM-dd");
		const end = format(range.to ?? range.from, "yyyy-MM-dd");
		navigate(
			`/meal-plans/meal/new?scheduleId=${schedule._id}&start=${start}&end=${end}`,
		);
	};

	const handleEditMeal = (meal: IMeal) => {
		if (!schedule || !meal._id) return;
		navigate(`/meal-plans/meal/${meal._id}/edit?scheduleId=${schedule._id}`);
	};

	const rangeLabel = range?.from
		? range.to && !isSameDay(range.from, range.to)
			? `${format(range.from, "MMM d")} – ${format(range.to, "MMM d")}`
			: format(range.from, "MMM d")
		: null;

	return (
		<div className="mx-auto w-full max-w-4xl px-4 py-8 md:py-10">
			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold">Meal Plans</h1>
				<p className="text-muted-foreground text-sm">
					Plan your monthly meals.
				</p>
			</div>

			{/* Month navigation */}
			<div className="mb-6 flex items-center justify-center gap-4">
				<Button variant="outline" size="icon" onClick={prevMonth}>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<span className="w-36 text-center text-lg font-medium">
					{format(currentMonth, "MMMM yyyy")}
				</span>
				<Button variant="outline" size="icon" onClick={nextMonth}>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			{/* Calendar */}
			<Card className="mb-6 border-border/60">
				<CardContent className="flex justify-center">
					{loading ? (
						<div className="p-8 text-sm text-muted-foreground">Loading…</div>
					) : (
						<Calendar
							mode="range"
							selected={range}
							onSelect={setRange}
							month={currentMonth}
							onMonthChange={setCurrentMonth}
							hideNavigation
							weekStartsOn={1}
						/>
					)}
				</CardContent>
			</Card>

			{/* Meals list */}
			<div>
				<div className="mb-3 flex items-center justify-between">
					<h2 className="text-sm font-medium text-muted-foreground">
						{range?.from ? `Meals for ${rangeLabel}` : "All meals this month"}
					</h2>
					<Button
						size="sm"
						onClick={handleAddMeal}
						disabled={!schedule || !range?.from}
					>
						<Plus className="h-4 w-4" />
						Add meal
					</Button>
				</div>
				{displayedMeals.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						{range?.from ? "No meals for this range." : "No meals this month."}
					</p>
				) : (
					<div className="flex flex-col gap-2">
						{displayedMeals.map((meal) => (
							<Card
								key={meal._id}
								className="cursor-pointer border-border/60 transition-colors hover:bg-accent/50"
								onClick={() => handleEditMeal(meal)}
							>
								<CardContent className="flex items-center justify-between p-4">
									<div>
										<p className="font-medium">
											{recipeMap[meal.recipe] ?? "Unknown recipe"}
										</p>
										<p className="text-sm text-muted-foreground">
											{mealTypeMap[meal.mealType] ?? "Unknown type"}
											{" · "}
											{meal.portion} portion
											{meal.portion !== 1 ? "s" : ""}
											{" · "}
											{format(new Date(meal.start), "MMM d")}
											{meal.end !== meal.start
												? ` – ${format(new Date(meal.end), "MMM d")}`
												: ""}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={(e) => {
												e.stopPropagation();
												navigate(`/recipes/${meal.recipe}`);
											}}
										>
											<BookOpen className="h-4 w-4 text-muted-foreground" />
										</Button>
										<Pencil className="h-4 w-4 text-muted-foreground" />
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MealPlans;
