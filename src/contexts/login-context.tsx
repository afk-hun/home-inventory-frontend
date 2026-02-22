import React from "react";

type LoginContextType = {	
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const LoginContext = React.createContext<LoginContextType>({
	isLoggedIn: false,
	setIsLoggedIn: (isLoggedIn: boolean) => {},
});

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

	return (
		<LoginContext.Provider
			value={{ isLoggedIn, setIsLoggedIn }}
		>
			{children}
		</LoginContext.Provider>
	);
}

export const useLogin = () => React.useContext(LoginContext);