import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { IShelfPlaceType } from "@/model/shelfPlaceType";
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

export const fetchShelfPlaceTypes = (): Promise<IShelfPlaceType[]> => {
	return authFetch(SERVER_URL + "/shelf/shelf-place-type", {
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
		.then((data) => data.shelfPlaces)
		.catch((err) => { throw err; });
};

export const createShelfPlaceType = (name: string): Promise<IShelfPlaceType> => {
	return authFetch(SERVER_URL + "/shelf/shelf-place-type", {
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
		.then((data) => data.shelfPlaceType)
		.catch((err) => { throw err; });
};

export const renameShelfPlaceType = (shelfPlaceTypeId: string, name: string): Promise<void> => {
	return authFetch(SERVER_URL + "/shelf/shelf-place-type", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ shelfPlaceTypeId, name }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => { throw err; });
};

export const deleteShelfPlaceType = (shelfPlaceTypeId: string): Promise<void> => {
	return authFetch(SERVER_URL + "/shelf/shelf-place-type", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ shelfPlaceTypeId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => { throw err; });
};
