import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
	{
		variants: {
			variant: {
				error:
					"border-transparent bg-red-500 text-white shadow-xs",
				warning:
					"border-transparent bg-orange-500 text-white shadow-xs",
				success:
					"border-transparent bg-green-500 text-white shadow-xs",
				outline: "text-foreground",
			}, 
		},
		defaultVariants: {
			variant: "error",
		},
	},
);

function Badge({
	className,
	variant,
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return (
		<span
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };