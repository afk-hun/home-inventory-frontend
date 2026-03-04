import React from "react";

type LoginContextType = {
	isLoggedIn: boolean;
	userId?: string;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const LoginContext = React.createContext<LoginContextType>({
	isLoggedIn: false,
	userId: undefined,
	setIsLoggedIn: (_isLoggedIn: boolean) => {
		throw new Error("setIsLoggedIn was called outside of a LoginProvider");
	},
});

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [userId, setUserId] = React.useState<string | undefined>(() => {
		if (typeof window === "undefined") {
			return undefined;
		}

		try {
			window.cookieStore.get("user_id").then((cookie) => {
					if (!cookie) {
						setIsLoggedIn(false);
					} else {
						setUserId(cookie.value);
					}
				});
			return;
		} catch {
			return undefined;
		}
	});

	const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(() => {
		if (typeof window === "undefined") {
			return false;
		}

		try {
			const stored = window.localStorage.getItem("isLoggedIn");
			if (stored === null) {
				return false;
			}

			return stored === "true";
		} catch {
			return false;
		}
	});

	React.useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		try {
			const stored = window.localStorage.getItem("isLoggedIn");
			if (stored === "true") {
				window.cookieStore.get("user_id").then((cookie) => {
					if (!cookie) {
						setIsLoggedIn(false);
					}
				});
			}
		} catch {
			// Ignore cookie errors
		}
	}, [isLoggedIn, setIsLoggedIn]);

	React.useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		try {
			window.localStorage.setItem(
				"isLoggedIn",
				isLoggedIn ? "true" : "false",
			);
		} catch {
			// Ignore storage errors (e.g., quota exceeded or disabled storage)
		}
	}, [isLoggedIn, setIsLoggedIn]);

	return (
		<LoginContext.Provider value={{ isLoggedIn, userId, setIsLoggedIn }}>
			{children}
		</LoginContext.Provider>
	);
};

export const useLogin = () => React.useContext(LoginContext);
