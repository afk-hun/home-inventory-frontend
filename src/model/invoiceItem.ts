export interface IInvoiceItemRecord {
	_id: string;
	householdId: string;
	store: {
		id: string;
		name: string;
	};
	inStoreId: string;
	inStoreName: string;
	inStorePrice: number;
	inStoreUnitPrice: number;
	inStoreQuantity: string;
	inStoreUnit: string;
	inStoreTaxType: string;
}
