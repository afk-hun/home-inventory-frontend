import React, { useEffect } from "react";

type User = {
	id: string;
	token: string;
} | null;

type LoginContextType = {
	user: User;
	setUser: (user: User | null) => void;
};

const LoginContext = React.createContext<LoginContextType>({
	user: null,
	setUser: (user: { id: string; token: string } | null) => {},
});

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = React.useState<{ id: string; token: string } | null>(null);

	useEffect(() => {
		const storedUserId = localStorage.getItem("userId");
		const storedToken = localStorage.getItem("token");

		if (storedUserId && storedToken) {
			setUser({ id: storedUserId, token: storedToken });
		}
	}, []);

	useEffect(() => {
		if (user) {
			localStorage.setItem("userId", user.id);
			localStorage.setItem("token", user.token);
		} else {
			localStorage.removeItem("userId");
			localStorage.removeItem("token");
		}
	}, [
		user
	]);

	return (
		<LoginContext.Provider
			value={{ user, setUser }}
		>
			{children}
		</LoginContext.Provider>
	);
}

export const useLogin = () => React.useContext(LoginContext);