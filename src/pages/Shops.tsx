import { useState } from "react";

import ShopsHeader from "@/components/shops/ShopsHeader";
import ShopInvoiceList from "@/components/shops/ShopInvoiceList";

const Shops = () => {
	const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
			<div className="mb-6 space-y-1">
				<h1 className="text-2xl font-semibold">Shops</h1>
				<p className="text-muted-foreground text-sm">
					Manage stores and link them to your invoices.
				</p>
			</div>
			<ShopsHeader
				selectedStoreId={selectedStoreId}
				onStoreChange={(id) => setSelectedStoreId(id || null)}
			/>
			<ShopInvoiceList storeId={selectedStoreId} />
		</div>
	);
};

export default Shops;
