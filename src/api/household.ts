import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { IHousehold } from "@/model/household";
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

export const fetchHouseholds = (): Promise<IHousehold[]> => {
	try {
		return authFetch(SERVER_URL + "/household/households", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...getCsrfHeaders(),
			},
		})
			.then(async (res) => {
				if (!res.ok) {
					throw new Error(await extractErrorMessage(res));
				}

				return res.json();
			})
			.then((data) => {
				return data.households;
			})
			.catch((err) => {
				throw err;
			});
	} catch (err) {
		throw err;
	}
};

export const createHousehold = (name: string ): Promise<IHousehold> => {
	try {
		return authFetch(SERVER_URL + "/household/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...getCsrfHeaders(),
			},
			body: JSON.stringify({ name}),
		})
			.then(async (res) => {
				if (!res.ok) {
					throw new Error(await extractErrorMessage(res));
				}

				return res.json();
			})
			.then((data) => {
				return data.household;
			})
			.catch((err) => {
				throw err;
			});
	} catch (err) {
		throw err;
	}
}

export const removeHousehold = (householdId: string): Promise<void> => {
	try {
		return authFetch(SERVER_URL + "/household/remove", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				...getCsrfHeaders(),
			},
			body: JSON.stringify({householdId }),
		})
			.then(async (res) => {
				if (!res.ok) {
					throw new Error(await extractErrorMessage(res));
				}
			})
			.catch((err) => {
				throw err;
			});
	} catch (err) {
		throw err;
	}
}

export const renameHousehold = (householdId: string, newName: string): Promise<void> => {
	try {
		return authFetch(SERVER_URL + "/household/rename", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				...getCsrfHeaders(),
			},
			body: JSON.stringify({ householdId, name: newName }),
		})
			.then(async (res) => {
				if (!res.ok) {
					throw new Error(await extractErrorMessage(res));
				}
			})
			.catch((err) => {
				throw err;
			});
	} catch (err) {
		throw err;
	}
}