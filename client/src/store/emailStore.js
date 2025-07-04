import { create } from 'zustand';
import { getEmailList } from '../api/emailApi.js';

export const useEmailStore = create((set, get) => ({
  emails: [],
  totalEmails: 0,
  loading: false,

  query: '',
  registrationType: [],
  paidStatus: [],
  fromDate: '',
  toDate: '',
  sortDirection: 'ascending',
  currentPage: 1,
  itemsPerPage: 5,

  setQuery: (value) => set({ query: value, currentPage: 1 }),
  setRegistrationType: (value) => set({ registrationType: Array.isArray(value) ? value : [value], currentPage: 1 }),
  setPaidStatus: (value) => set({ paidStatus: Array.isArray(value) ? value : [value], currentPage: 1 }),
  setFromDate: (value) => set({ fromDate: value, currentPage: 1 }),
  setToDate: (value) => set({ toDate: value, currentPage: 1 }),
  setSortDirection: () =>
    set((state) => ({
      sortDirection: state.sortDirection === 'ascending' ? 'descending' : 'ascending',
      currentPage: 1,
    })),

  setPage: (page) => set({ currentPage: page }),
  clearAll: () =>
    set({
      query: '',
      registrationType: [],
      paidStatus: [],
      fromDate: '',
      toDate: '',
      currentPage: 1,
    }),

  fetchEmails: async () => {
    const state = get();
    set({ loading: true });

    try {
      const params = {
        search: state.query,
        registration_type: state.registrationType,
        is_paid: state.paidStatus,
        from_date: state.fromDate,
        to_date: state.toDate,
        page: state.currentPage,
        limit: state.itemsPerPage,
        sort: 'name',
        direction: state.sortDirection === 'ascending' ? 'asc' : 'desc',
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === '' || (Array.isArray(params[key]) && params[key].length === 0) || params[key] == null) {
          delete params[key];
        }
      });

      console.log('Query Params:', params); 
      const data = await getEmailList(params);
      console.log('API Response:', data);
      set({
        emails: data.data || [],
        totalEmails: data.total || 0,
      });
    } catch (err) {
      console.error('Error loading emails:', err);
      set({ emails: [], totalEmails: 0 }); 
    } finally {
      set({ loading: false });
    }
  },
}));