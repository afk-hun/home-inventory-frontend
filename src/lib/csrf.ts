const CSRF_COOKIE_NAMES = [
	"XSRF-TOKEN",
	"CSRF-TOKEN",
	"csrfToken",
	"csrf_token",
];

const getTokenFromMetaTag = (): string | null => {
	const meta = document.querySelector('meta[name="csrf-token"]');
	const token = meta?.getAttribute("content");
	return token && token.trim().length > 0 ? token : null;
};

const getTokenFromCookie = (): string | null => {
	if (!document.cookie) {
		return null;
	}

	const cookieParts = document.cookie.split(";");
	for (const part of cookieParts) {
		const [name, ...valueParts] = part.trim().split("=");
		if (!CSRF_COOKIE_NAMES.includes(name)) {
			continue;
		}

		const value = valueParts.join("=");
		if (!value) {
			continue;
		}

		return decodeURIComponent(value);
	}

	return null;
};

export const getCsrfToken = (): string | null => {
	return getTokenFromMetaTag() || getTokenFromCookie();
};

export const ensureCsrfToken = async (serverUrl: string): Promise<string | null> => {
	const existingToken = getCsrfToken();
	if (existingToken) {
		return existingToken;
	}

	try {
		await fetch(`${serverUrl}/auth/csrf-token`, {
			method: "GET",
			credentials: "include",
		});
	} catch {
		return null;
	}

	return getCsrfToken();
};

export const getCsrfHeaders = (): Record<string, string> => {
	const token = getCsrfToken();
	if (!token) {
		return {};
	}

	return {
		"X-CSRF-Token": token,
	};
};
