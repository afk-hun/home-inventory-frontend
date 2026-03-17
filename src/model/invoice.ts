export interface IInvoiceItem {
	inStoreId: string;
	inStoreName: string;
	inStorePrice: number;
	inStoreUnitPrice: number;
	inStoreQuantity: string;
	inStoreUnit: string;
	inStoreTaxType: string;
}

export interface IInvoice {
	_id: string;
	householdId: string;
	storeId: string;
	storeName: string;
	storeAddress: string;
	purchaseDate: string;
	invoiceItems: IInvoiceItem[];
}
