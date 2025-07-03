// store/productStore.js
import { create } from 'zustand';
import { fetchShopifyProducts } from '../api/ProductApi.js';

const useProductStore = create((set) => ({
  searchResults: [],
  loading: false,
  selectedProduct: null,

  searchProducts: async (query) => {
    if (!query || query.length < 2) return set({ searchResults: [], loading: false });
    set({ loading: true });
    try {
      const products = await fetchShopifyProducts(query);
      const formatted = products.map((product) => ({
        label: product.title,
        value: String(product.id),
      }));
      console.log(products);
      set({ searchResults: formatted });
    } catch (error) {
      console.error('Search failed:', error);
      set({ searchResults: [] });
    } finally {
      set({ loading: false });
    }
  },

  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));

export default useProductStore;
