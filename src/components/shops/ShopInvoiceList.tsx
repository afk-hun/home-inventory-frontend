import { useState, useEffect } from "react";

import { IInvoice } from "@/model/invoice";
import { fetchInvoicesByStore } from "@/api/invoice";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface ShopInvoiceListProps {
	storeId: string | null;
}

const formatDate = (dateStr: string): string => {
	return new Date(dateStr).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const ShopInvoiceList = ({ storeId }: ShopInvoiceListProps) => {
	const [invoices, setInvoices] = useState<IInvoice[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!storeId) {
			setInvoices([]);
			return;
		}

		setLoading(true);
		setError(null);

		fetchInvoicesByStore(storeId)
			.then((data) => setInvoices(data))
			.catch((err) => {
				console.error("Failed to fetch invoices:", err);
				setError("Failed to load invoices.");
			})
			.finally(() => setLoading(false));
	}, [storeId]);

	if (!storeId) return null;

	if (loading) {
		return (
			<p className="text-muted-foreground py-4 text-sm">Loading invoices…</p>
		);
	}

	if (error) {
		return <p className="text-destructive py-4 text-sm">{error}</p>;
	}

	if (invoices.length === 0) {
		return (
			<div className="text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
				No invoices found for this shop.
			</div>
		);
	}

	return (
		<Accordion type="multiple" className="w-full">
			{invoices.map((invoice) => (
				<AccordionItem key={invoice._id} value={invoice._id}>
					<AccordionTrigger>
						<div className="flex items-center gap-2">
							<span className="font-medium">{invoice.storeName}</span>
							<span className="text-muted-foreground text-xs">{invoice.storeAddress}</span>
							<span className="text-muted-foreground text-xs">{formatDate(invoice.purchaseDate)}</span>
						</div>
					</AccordionTrigger>
					<AccordionContent>
						{invoice.invoiceItems.length === 0 ? (
							<p className="text-muted-foreground text-sm">
								No items in this invoice.
							</p>
						) : (
							<table className="w-full text-sm">
								<thead>
									<tr className="text-muted-foreground border-b text-left">
										<th className="pb-2 font-medium">Item</th>
										<th className="pb-2 font-medium">Qty</th>
										<th className="pb-2 font-medium">Unit</th>
										<th className="pb-2 text-right font-medium">Price</th>
									</tr>
								</thead>
								<tbody>
									{invoice.invoiceItems.map((item, idx) => (
										<tr key={idx} className="border-b last:border-0">
											<td className="py-2">{item.inStoreName}</td>
											<td className="py-2">{item.inStoreQuantity}</td>
											<td className="py-2">{item.inStoreUnit}</td>
											<td className="py-2 text-right">
												{item.inStorePrice.toFixed(2)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
};

export default ShopInvoiceList;
