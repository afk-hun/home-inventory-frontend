import { getCsrfHeaders, ensureCsrfToken } from "@/lib/csrf";
import { SERVER_URL } from "@/utils/constAndTypes";

const redirectToLogin = () => {
	try {
		window.localStorage.setItem("isLoggedIn", "false");
	} catch {
		// noop
	}

	if (window.location.pathname !== "/login") {
		window.location.replace("/login");
	}
};

const isUnauthorized = (response: Response): boolean => {
	return response.status === 401;
};

const refreshSession = async (): Promise<boolean> => {
	if (!SERVER_URL || typeof SERVER_URL !== "string") {
		return false;
	}

	try {
		await ensureCsrfToken(SERVER_URL);
		const response = await fetch(`${SERVER_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
			headers: {
				...getCsrfHeaders(),
			},
		});

		return response.ok;
	} catch {
		return false;
	}
};

export const authFetch = async (
	input: RequestInfo | URL,
	init: RequestInit = {},
): Promise<Response> => {
	const response = await fetch(input, {
		...init,
		credentials: "include",
	});

	if (!isUnauthorized(response)) {
		return response;
	}

	const refreshed = await refreshSession();
	if (!refreshed) {
		redirectToLogin();
		return response;
	}

	return fetch(input, {
		...init,
		credentials: "include",
	});
};
