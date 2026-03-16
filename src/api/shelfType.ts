import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { IShelfType } from "@/model/shelfType";
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

export const fetchShelfTypes = (): Promise<IShelfType[]> => {
	return authFetch(SERVER_URL + "/shelf/shelf-type", {
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
		.then((data) => data.shelfTypes)
		.catch((err) => { throw err; });
};

export const createShelfType = (name: string): Promise<IShelfType> => {
	return authFetch(SERVER_URL + "/shelf/shelf-type", {
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
		.then((data) => data.shelfType)
		.catch((err) => { throw err; });
};

export const renameShelfType = (shelfTypeId: string, name: string): Promise<void> => {
	return authFetch(SERVER_URL + "/shelf/shelf-type", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ shelfTypeId, name }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => { throw err; });
};

export const deleteShelfType = (shelfTypeId: string): Promise<void> => {
	return authFetch(SERVER_URL + "/shelf/shelf-type", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ shelfTypeId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => { throw err; });
};
