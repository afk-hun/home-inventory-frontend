import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { ICookingSchedule, IMeal } from "@/model/cookingSchedule";
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

export interface ISchedulePayload {
	name: string;
	start: string;
	end: string;
	meals?: IMeal[];
}

export const fetchSchedules = (): Promise<ICookingSchedule[]> => {
	return authFetch(SERVER_URL + "/cooking-schedule", {
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
		.then((data) => data.schedules)
		.catch((err) => { throw err; });
};

export const fetchSchedule = (id: string): Promise<ICookingSchedule> => {
	return authFetch(SERVER_URL + "/cooking-schedule/" + id, {
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
		.then((data) => data.schedule)
		.catch((err) => { throw err; });
};

export const createSchedule = (payload: ISchedulePayload): Promise<ICookingSchedule> => {
	return authFetch(SERVER_URL + "/cooking-schedule", {
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
		.then((data) => data.schedule)
		.catch((err) => { throw err; });
};

export const updateSchedule = (
	scheduleId: string,
	updates: { name?: string; start?: string; end?: string; meals?: IMeal[] },
): Promise<ICookingSchedule> => {
	return authFetch(SERVER_URL + "/cooking-schedule", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			...getCsrfHeaders(),
		},
		body: JSON.stringify({ scheduleId, ...updates }),
	})
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.schedule)
		.catch((err) => { throw err; });
};
