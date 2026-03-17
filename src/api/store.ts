import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { IStore } from "@/model/store";
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

export const fetchStores = (): Promise<IStore[]> => {
	return authFetch(SERVER_URL + "/store/store?limit=100", {
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
		.then((data) => data.stores)
		.catch((err) => {
			throw err;
		});
};

export const createStore = (name: string): Promise<IStore> => {
	return authFetch(SERVER_URL + "/store/store", {
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
		.then((data) => data.store)
		.catch((err) => {
			throw err;
		});
};

export const deleteStore = (storeId: string): Promise<void> => {
	return authFetch(SERVER_URL + "/store/store", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ storeId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => {
			throw err;
		});
};
