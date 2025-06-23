import { create } from 'zustand';
import { getAttendeeList } from '../api/attendeeApi.js';

export const useAttendeeStore = create((set, get) => ({
  attendees: [],
  totalAttendees: 0,
  loading: false,   

  query: '',
  registrationType: [],
  paidStatus: [],
  registeredDate: '',
  sortDirection: 'ascending',
  currentPage: 1,
  itemsPerPage: 5,

  setQuery: (value) => set({ query: value, currentPage: 1 }),
  setRegistrationType: (value) => set({ registrationType: value, currentPage: 1 }),
  setPaidStatus: (value) => set({ paidStatus: value, currentPage: 1 }),
  setRegisteredDate: (value) => set({ registeredDate: value, currentPage: 1 }),
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
      registeredDate: '',
      currentPage: 1,
    }),

  fetchAttendees: async () => {
    const state = get();
    set({ loading: true });

    try {
      const data = await getAttendeeList({
        search: state.query,
        registration_type: state.registrationType,
        is_paid: state.paidStatus,
        page: state.currentPage,
        from_date: state.registeredDate,
        to_date: state.registeredDate,
        limit: state.itemsPerPage,
        sort: 'name',
        direction: state.sortDirection === 'ascending' ? 'asc' : 'desc',
      });
      console.log('data', data);
      set({
        attendees: data.attendees || [],
        totalAttendees: data.total || 0,
      });
    } catch (err) {
      console.error('Error loading attendees:', err);
    } finally {
      set({ loading: false });
    }
  },
}));
