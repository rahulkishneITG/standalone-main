import { create } from 'zustand';
import { getEditEventData } from '../api/eventApi.js';

const EditEventStore = create((set) => ({
    eventData: null,
    loading: true,
    error: null,

    fetchEventDataById: async (eventId) => {

        set({ loading: true, error: null });
        try {
            const data = await getEditEventData(eventId);
            set({ eventData: data, loading: false });
        } catch (error) {
            console.error('[Dashboard Fetch Error]:', error);
            set({ error: 'Failed to fetch data', loading: false });
        }
    },
}));

export default EditEventStore;   