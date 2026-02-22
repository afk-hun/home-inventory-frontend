import React from "react";

type User = {
	id: string;
} | null;

type LoginContextType = {
	user: User;
	setUser: (user: User | null) => void;
};

const LoginContext = React.createContext<LoginContextType>({
	user: null,
	setUser: (_user: { id: string } | null) => {},
});

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = React.useState<{ id: string } | null>(null);

	return (
		<LoginContext.Provider
			value={{ user, setUser }}
		>
			{children}
		</LoginContext.Provider>
	);
}

export const useLogin = () => React.useContext(LoginContext);