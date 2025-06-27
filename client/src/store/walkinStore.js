import { create } from 'zustand';
import { getWalkinList } from '../api/walkinApi';

const initialState = {
  walkinList: [],   // ✅ renamed
  totalCount: 0,
  loading: false,
  error: null,
};

const useWalkinStore = create((set) => ({
  ...initialState,

  fetchWalkinList: async ({
    page = 1,
    limit = 5,
    search = '',
    sortBy = 'name',
    order = 'asc',
  }) => {
    set({ loading: true, error: null });

    try {
      const res = await getWalkinList({ page, limit, search, sortBy, order });

      set({
        walkinList: res.data || [], // ✅ use correct key here
        totalCount: res.total || 0,
        loading: false,
      });
    } catch (error) {
      console.error('[Fetch Walkins Failed]:', error);
      set({
        walkinList: [],
        totalCount: 0,
        error: 'Unable to fetch walk-ins.',
        loading: false,
      });
    }
  },

  resetWalkinStore: () => set(initialState),
}));

export default useWalkinStore;
