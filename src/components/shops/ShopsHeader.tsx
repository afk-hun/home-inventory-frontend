import ResourceSelectorHeader from "@/components/ResourceSelectorHeader";
import { fetchStores, createStore, deleteStore } from "@/api/store";

interface ShopsHeaderProps {
	selectedStoreId: string | null;
	onStoreChange: (storeId: string) => void;
}

const ShopsHeader = ({ selectedStoreId, onStoreChange }: ShopsHeaderProps) => (
	<ResourceSelectorHeader
		selectedId={selectedStoreId}
		onSelectionChange={onStoreChange}
		fetchItems={fetchStores}
		createItem={createStore}
		deleteItem={deleteStore}
		entityLabel="shop"
		inputPlaceholder="New shop name"
	/>
);

export default ShopsHeader;
