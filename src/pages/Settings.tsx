import { useState } from "react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HouseholdSettingsSection from "@/components/settings/HouseholdSettingsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sections = [
	{
		key: "user",
		title: "User",
		description: "Manage profile details.",
		component: <>User</>
	},
	{
		key: "household",
		title: "Household",
		description: "Manage households and members.",
		component: <HouseholdSettingsSection />, 
	},
	{
		key: "shelf",
		title: "Shelf",
		description: "Edit shelf defaults.",
		component: <>Shelf</>
	},
	{
		key: "items",
		title: "Items",
		description: "Set item defaults.",
		component: <>Items</>
	},
] as const;

type SectionKey = (typeof sections)[number]["key"];

const Settings = () => {
	const [activeSection, setActiveSection] = useState<SectionKey>("user");

	const renderSectionContent = (section: (typeof sections)[number]) => (
		<>
			<div className="mb-4">
				<h2 className="text-lg font-semibold">{section.title}</h2>
				<p className="text-muted-foreground text-sm">{section.description}</p>
			</div>
			{section.component}
		</>
	);

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold">Settings</h1>
				<p className="text-muted-foreground text-sm">
					Edit your user, household, shelf, and item settings.
				</p>
			</div>

			<Card className="hidden border-border/60 md:block">
				<CardHeader>
					<CardTitle>Settings</CardTitle>
					<CardDescription>Select a tab to edit that section.</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs
						value={activeSection}
						onValueChange={(value) => setActiveSection(value as SectionKey)}
					>
						<TabsList className="grid h-auto w-full grid-cols-2 gap-1 md:grid-cols-4">
							{sections.map((section) => (
								<TabsTrigger key={section.key} value={section.key} className="py-2">
									{section.title}
								</TabsTrigger>
							))}
						</TabsList>

						{sections.map((section) => (
							<TabsContent key={section.key} value={section.key} className="mt-4 space-y-1">
								{renderSectionContent(section)}
							</TabsContent>
						))}
					</Tabs>
				</CardContent>
			</Card>

			<Card className="border-border/60 md:hidden">
				<CardHeader>
					<CardTitle>Settings</CardTitle>
					<CardDescription>Select a section and edit details.</CardDescription>
				</CardHeader>
				<CardContent>
					<Accordion type="single" collapsible className="w-full">
						{sections.map((section) => (
							<AccordionItem key={section.key} value={section.key}>
								<AccordionTrigger>{section.title}</AccordionTrigger>
								<AccordionContent>
									{renderSectionContent(section)}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</CardContent>
			</Card>
		</div>
	);
};

export default Settings;