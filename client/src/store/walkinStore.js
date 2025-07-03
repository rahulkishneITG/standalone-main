import { create } from 'zustand';
import { getWalkinList, getWalkinById, submitWalkinForm } from '../api/walkinApi';

const initialState = {
  walkinList: [], 
  walkinDetails: null,
  eventDetails: null,
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
        walkinList: res.data || [], 
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
  fetchWalkinById: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await getWalkinById(id);
      console.log('Fetched walkin details:', res.data);
      set({ walkinDetails: res.data || null, eventDetails: res.data?.event_details || null, loading: false });
    } catch (error) {
      console.error('[Fetch Walkin by ID Failed]:', error);
      set({ walkinDetails: null, error: 'Unable to fetch walk-in details.', loading: false });
    }
  },
  submitWalkinForm: async (payload) => {
    set({ loading: true, error: null });
  
    try {
      const res = await submitWalkinForm(payload);
      alert('Registration successful!');
      setTimeout(() => {
        window.location.href = '/checkout';
      }, 1500);
      return res;
    } catch (error) {
      console.error('[Walkin Form Submission Failed]:', error);
      alert('Something went wrong. Please try again.');
      set({ error: 'Walk-in form submission failed.' });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  
  resetWalkinStore: () => set(initialState),
}));

export default useWalkinStore;
