import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { IShoppingList, IShoppingListItem } from "@/model/shoppingList";
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

export const fetchShoppingLists = (): Promise<IShoppingList[]> => {
	return authFetch(SERVER_URL + "/shopping-list/shopping-list", {
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
		.then((data) => data.shoppingLists)
		.catch((err) => { throw err; });
};

export const fetchShoppingList = (shoppingListId: string): Promise<IShoppingList> => {
	return authFetch(SERVER_URL + "/shopping-list/shopping-list/" + shoppingListId, {
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
		.then((data) => data.shoppingList)
		.catch((err) => { throw err; });
};

export const createShoppingList = (payload: {
	name: string;
	storeId: string;
	items: IShoppingListItem[];
}): Promise<IShoppingList> => {
	return authFetch(SERVER_URL + "/shopping-list/shopping-list", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify(payload),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.shoppingList)
		.catch((err) => { throw err; });
};

export const updateShoppingList = (
	shoppingListId: string,
	payload: { name?: string; storeId?: string; items?: IShoppingListItem[] },
): Promise<IShoppingList> => {
	return authFetch(SERVER_URL + "/shopping-list/shopping-list", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ shoppingListId, ...payload }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.shoppingList)
		.catch((err) => { throw err; });
};

export const deleteShoppingList = (shoppingListId: string): Promise<void> => {
	return authFetch(SERVER_URL + "/shopping-list/shopping-list", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ shoppingListId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => { throw err; });
};
