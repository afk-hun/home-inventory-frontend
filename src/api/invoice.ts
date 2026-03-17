import { getCsrfHeaders } from "@/lib/csrf";
import { authFetch } from "@/lib/auth-fetch";
import { IInvoice } from "@/model/invoice";
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

export const fetchInvoicesByStore = (storeId: string): Promise<IInvoice[]> => {
	return authFetch(
		SERVER_URL + `/invoice/invoice?storeId=${encodeURIComponent(storeId)}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				...getCsrfHeaders(),
			},
		},
	)
		.then(async (res) => {
			if (!res.ok) throw new Error(await extractErrorMessage(res));
			return res.json();
		})
		.then((data) => data.invoices)
		.catch((err) => {
			throw err;
		});
};
