import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { IShelf } from "@/model/shelf";
import { SERVER_URL } from "@/utils/constAndTypes";

const extractErrorMessage = async (res: Response): Promise<string> => {
	try {
		const data = await res.json();
		if (data && typeof data.message === "string") {
			return data.message;
		}
	} catch {
		// noop
	}
	return "Request failed.";
};

export const fetchShelves = (): Promise<IShelf[]> => {
	return authFetch(SERVER_URL + "/shelf/shelf?limit=100", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.shelves)
		.catch((err) => {
			throw err;
		});
};

export const createShelf = (name: string): Promise<IShelf> => {
	return authFetch(SERVER_URL + "/shelf/shelf", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ name }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.shelf)
		.catch((err) => {
			throw err;
		});
};

export const fetchShelf = (shelfId: string): Promise<IShelf> => {
	return authFetch(SERVER_URL + `/shelf/shelf/${shelfId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.shelf)
		.catch((err) => {
			throw err;
		});
};

export const updateShelf = (
	shelfId: string,
	updates: { name?: string; place?: string; type?: string },
): Promise<IShelf> => {
	return authFetch(SERVER_URL + "/shelf/shelf", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ shelfId, ...updates }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.shelf)
		.catch((err) => {
			throw err;
		});
};

export const addShelfItem = (
	shelfId: string,
	itemId: string,
	itemName: string | undefined,
	quantity: number,
	unit: string | undefined,
): Promise<void> => {
	return authFetch(SERVER_URL + "/shelf/shelf/add-item", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ shelfId, itemId, itemName, quantity, unit }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => {
			throw err;
		});
};

export const removeShelfItem = (
	shelfId: string,
	shelfItemId: string,
): Promise<void> => {
	return authFetch(SERVER_URL + "/shelf/shelf/remove-item", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ shelfId, shelfItemId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => {
			throw err;
		});
};

export const deleteShelf = (shelfId: string): Promise<void> => {
	return authFetch(SERVER_URL + "/shelf/shelf", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ shelfId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => {
			throw err;
		});
};
