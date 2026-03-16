import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { IItemType } from "@/model/itemType";
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

export const fetchItemTypes = (): Promise<IItemType[]> => {
	return authFetch(SERVER_URL + "/shelf/item-type", {
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
		.then((data) => data.itemTypes)
		.catch((err) => {
			throw err;
		});
};

export const createItemType = (name: string): Promise<IItemType> => {
	return authFetch(SERVER_URL + "/shelf/item-type", {
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
		.then((data) => data.itemType)
		.catch((err) => {
			throw err;
		});
};

export const renameItemType = (itemTypeId: string, name: string): Promise<void> => {
	return authFetch(SERVER_URL + "/shelf/item-type", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ itemTypeId, name }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => {
			throw err;
		});
};

export const deleteItemType = (itemTypeId: string): Promise<void> => {
	return authFetch(SERVER_URL + "/shelf/item-type", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ itemTypeId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => {
			throw err;
		});
};
