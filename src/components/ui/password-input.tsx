import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type PasswordStrength = "weak" | "medium" | "strong";

function getPasswordStrength(password: string): PasswordStrength {
	let score = 0;

	if (password.length >= 8) {
		score += 1;
	}
	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
		score += 1;
	}
	if (/\d/.test(password)) {
		score += 1;
	}
	if (/[^A-Za-z0-9]/.test(password)) {
		score += 1;
	}

	if (password.length < 6 || score <= 1) {
		return "weak";
	}

	if (score <= 3) {
		return "medium";
	}

	return "strong";
}

function getStrengthBadgeVariant(strength: PasswordStrength) {
	if (strength === "weak") {
		return "error" as const;
	}

	if (strength === "medium") {
		return "warning" as const;
	}

	return "success" as const;
}

type PasswordInputProps = React.ComponentProps<"input"> & {
	showStrengthBadge?: boolean;
};

function PasswordInput({
	showStrengthBadge = true,
	value,
	...props
}: PasswordInputProps) {
	const password = typeof value === "string" ? value : "";
	const shouldShowBadge = showStrengthBadge && password.length > 0;
	const strength = getPasswordStrength(password);

	return (
		<div className="space-y-2">
			<Input type="password" value={value} {...props} />
			{shouldShowBadge && (
				<Badge variant={getStrengthBadgeVariant(strength)}>
					{strength === "weak"
						? "Weak password"
						: strength === "medium"
							? "Medium password"
							: "Strong password"}
				</Badge>
			)}
		</div>
	);
}

export { PasswordInput };