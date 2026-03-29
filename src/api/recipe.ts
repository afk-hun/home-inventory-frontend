import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { IRecipe } from "@/model/recipe";
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

export interface IRecipePayload {
	name: string;
	type?: string;
	ingredients?: { item: string; quantity: number; unit: string }[];
	portion?: number;
	description?: string;
}

export interface IRecipeUpdatePayload extends IRecipePayload {
	recipeId: string;
}

export const fetchRecipes = (): Promise<IRecipe[]> => {
	return authFetch(SERVER_URL + "/recipe/recipes", {
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
		.then((data) => data.recipes)
		.catch((err) => { throw err; });
};

export const fetchRecipe = (id: string): Promise<IRecipe> => {
	return authFetch(SERVER_URL + "/recipe/recipes/" + id, {
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
		.then((data) => data.recipe)
		.catch((err) => { throw err; });
};

export const createRecipe = (payload: IRecipePayload): Promise<IRecipe> => {
	return authFetch(SERVER_URL + "/recipe/recipes", {
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
		.then((data) => data.recipe)
		.catch((err) => { throw err; });
};

export const updateRecipe = (recipeId: string, payload: IRecipePayload): Promise<IRecipe> => {
	return authFetch(SERVER_URL + "/recipe/recipes", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ recipeId, ...payload }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.recipe)
		.catch((err) => { throw err; });
};

export const deleteRecipe = (recipeId: string): Promise<void> => {
	return authFetch(SERVER_URL + "/recipe/recipes", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ recipeId }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
		})
		.catch((err) => { throw err; });
};
