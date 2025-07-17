import { create } from 'zustand';
import { fetchAttendeesAPI } from '../api/attendeeApi'; 

export const useAttendeeStore = create((set) => ({
  attendees: [],
  totalAttendees: 0,
  query: '',
  registrationType: [],
  paidStatus: [],
  registeredDate: '',
  eventName: '',
  sortDirection: 'asc',
  currentPage: 1,
  itemsPerPage: 5,
  error: null,

  setQuery: (value) => set({ query: value }),
  setRegistrationType: (value) => set({ registrationType: value }),
  setPaidStatus: (value) => set({ paidStatus: value }),
  setRegisteredDate: (value) => set({ registeredDate: value }),
  setEventName: (value) => set({ eventName: value }),
  setSortDirection: () =>
    set((state) => ({ sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' })),
  setPage: (page) => set({ currentPage: page }),
  clearAll: () =>
    set({
      query: '',
      registrationType: [],
      paidStatus: [],
      registeredDate: '',
      eventName: '',
    }),

  fetchAttendees: async () => {
    try {
      const state = useAttendeeStore.getState();
      const { attendees, totalAttendees } = await fetchAttendeesAPI(state);
      set({ attendees, totalAttendees, error: null });
    } catch (error) {
      console.error('Error fetching attendees:', error);
      set({ attendees: [], totalAttendees: 0, error: error.message });
    }
  },
}));
