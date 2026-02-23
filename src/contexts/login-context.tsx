import React from "react";

type LoginContextType = {
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const LoginContext = React.createContext<LoginContextType>({
	isLoggedIn: false,
	setIsLoggedIn: (_isLoggedIn: boolean) => {
		throw new Error("setIsLoggedIn was called outside of a LoginProvider");
	},
});

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
			window.localStorage.setItem(
				"isLoggedIn",
				isLoggedIn ? "true" : "false",
			);
		} catch {
			// Ignore storage errors (e.g., quota exceeded or disabled storage)
		}
	}, [isLoggedIn]);

	return (
		<LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
			{children}
		</LoginContext.Provider>
	);
};

export const useLogin = () => React.useContext(LoginContext);
