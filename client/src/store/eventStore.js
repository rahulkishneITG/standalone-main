// import { create } from 'zustand';
// import { getEventList, deleteEventById } from '../api/eventApi';

// const initialState = {
//   eventList: [],
//   totalCount: 0,
//   loading: false,
//   error: null,
// };

// const useEventStore = create((set) => ({
//   ...initialState,

//   fetchEventList: async ({
//     page = 1,
//     limit = 5,
//     search = '',
//     sortBy = 'name',
//     order = 'asc',
//   }) => {
//     set({ loading: true, error: null });

//     try {
//       const res = await getEventList({ page, limit, search, sortBy, order });

//       set({
//         eventList: res.data || [],
//         totalCount: res.total || 0,
//         loading: false,
//       });
//     } catch (error) {
//       console.error('[Fetch Events Failed]:', error);
//       set({
//         eventList: [],
//         totalCount: 0,
//         error: 'Unable to fetch events.',
//         loading: false,
//       });
//     }
//   },

//   deleteEvent: async (eventId, onSuccess) => {
//     try {
//       await deleteEventById(eventId);
//       if (typeof onSuccess === 'function') onSuccess();
//     } catch (error) {
//       console.error('[Delete Event Failed]:', error);
//     }
//   },
//   fetchEventDetails: async (event_id) => {
//     set({ loading: true, error: null });
//     try {
//       const { data } = await axios.get(`http://localhost:5000/api/events/${event_id}`);
//       set({ eventDetails: data, loading: false });
//     } catch (err) {
//       set({ error: err.message || 'Failed to fetch event', loading: false });
//     }
//   },

//   resetEventStore: () => set(initialState),
// }));

// export default useEventStore;


import { create } from 'zustand';
import axios from 'axios'; 
import { getEventList, deleteEventById, getEventData } from '../api/eventApi';

const initialState = {
  eventList: [],
  totalCount: 0,
  eventDetails: null, 
  loading: false,
  error: null,
};

const useEventStore = create((set) => ({
  ...initialState,

  //  Fetch paginated & searchable event list
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

  //  Delete event by ID
  deleteEvent: async (eventId, onSuccess) => {
    try {
      await deleteEventById(eventId);
      if (typeof onSuccess === 'function') onSuccess();
    } catch (error) {
      console.error('[Delete Event Failed]:', error);
    }
  },

  //  Fetch single event details by event_id
  fetchEventDetails: async (event_id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await getEventData(event_id);
      set({ eventDetails: data, loading: false });
    } catch (err) {
      console.error('[Fetch Event Details Failed]:', err);
      set({ error: err.message || 'Failed to fetch event', loading: false });
    }
  },
  

  // Reset full store
  resetEventStore: () => set(initialState),
}));

export default useEventStore;
