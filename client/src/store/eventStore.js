import { create } from 'zustand';
import { getEventList, deleteEventById } from '../api/eventApi';

const initialState = {
  eventList: [],
  totalCount: 0,
  loading: false,
  error: null,
};

const useEventStore = create((set) => ({
  ...initialState,

  fetchEventList: async ({
    page = 1,
    limit = 5,
    search = '',
    sortBy = 'name',
    order = 'asc',
  }) => {
    set({ loading: true, error: null });

    try {
      const res = await getEventList({ page, limit, search, sortBy, order });

      set({
        eventList: res.data || [],
        totalCount: res.total || 0,
        loading: false,
      });
    } catch (error) {
      console.error('[Fetch Events Failed]:', error);
      set({
        eventList: [],
        totalCount: 0,
        error: 'Unable to fetch events.',
        loading: false,
      });
    }
  },

  deleteEvent: async (eventId, onSuccess) => {
    try {
      await deleteEventById(eventId);
      if (typeof onSuccess === 'function') onSuccess();
    } catch (error) {
      console.error('[Delete Event Failed]:', error);
    }
  },

  resetEventStore: () => set(initialState),
}));

export default useEventStore;
