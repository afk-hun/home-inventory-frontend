import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { IConnectedStore, IItem } from "@/model/item";
import { IFavoriteItem } from "@/model/favoriteItem";
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

export const fetchItems = (): Promise<IItem[]> => {
	return authFetch(SERVER_URL + "/shelf/item?limit=100", {
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
		.then((data) => data.items)
		.catch((err) => {
			throw err;
		});
};

export const fetchItemsByStore = (storeId: string): Promise<IItem[]> => {
	return authFetch(SERVER_URL + "/shelf/item?limit=100&storeId=" + encodeURIComponent(storeId), {
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
		.then((data) => data.items)
		.catch((err) => {
			throw err;
		});
};

export const createItem = (name: string, type?: string): Promise<IItem> => {
	return authFetch(SERVER_URL + "/shelf/item", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ name, ...(type ? { type } : {}) }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.item)
		.catch((err) => {
			throw err;
		});
};

export const updateItem = (
	itemId: string,
	updates: { name?: string; type?: string | null; connectedStores?: IConnectedStore[] },
): Promise<IItem> => {
	return authFetch(SERVER_URL + "/shelf/item", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ itemId, ...updates }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.item)
		.catch((err) => {
			throw err;
		});
};

export const deleteItem = (itemId: string): Promise<void> => {
	return authFetch(SERVER_URL + "/shelf/item", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ itemId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => {
			throw err;
		});
};

export const fetchFavoriteItems = (): Promise<IFavoriteItem[]> => {
	return authFetch(SERVER_URL + "/shelf/item/favorite", {
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
		.then((data) => data.favorites)
		.catch((err) => {
			throw err;
		});
};

export const addFavoriteItem = (itemId: string): Promise<boolean> => {
	return authFetch(SERVER_URL + "/shelf/item/favorite", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ itemId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.isFavorite as boolean)
		.catch((err) => {
			throw err;
		});
};

export const removeFavoriteItem = (itemId: string): Promise<boolean> => {
	return authFetch(SERVER_URL + "/shelf/item/favorite", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ itemId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.isFavorite as boolean)
		.catch((err) => {
			throw err;
		});
};

export const toggleFavoriteItem = (itemId: string, isFavorite: boolean): Promise<boolean> => {
	return isFavorite ? removeFavoriteItem(itemId) : addFavoriteItem(itemId);
};

export const removeOneFavoriteItem = (itemId: string): Promise<IFavoriteItem> => {
	return authFetch(SERVER_URL + "/shelf/item/favorite/remove-one", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ itemId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.favorite)
		.catch((err) => {
			throw err;
		});
};
