import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { IRecipeType } from "@/model/recipeType";
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

export const fetchRecipeTypes = (): Promise<IRecipeType[]> => {
	return authFetch(SERVER_URL + "/recipe/recipe-type", {
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
		.then((data) => data.recipeTypes)
		.catch((err) => { throw err; });
};

export const createRecipeType = (name: string): Promise<IRecipeType> => {
	return authFetch(SERVER_URL + "/recipe/recipe-type", {
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
		.then((data) => data.recipeType)
		.catch((err) => { throw err; });
};

export const renameRecipeType = (recipeTypeId: string, name: string): Promise<void> => {
	return authFetch(SERVER_URL + "/recipe/recipe-type", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ recipeTypeId, name }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => { throw err; });
};

export const deleteRecipeType = (recipeTypeId: string): Promise<void> => {
	return authFetch(SERVER_URL + "/recipe/recipe-type", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ recipeTypeId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => { throw err; });
};
