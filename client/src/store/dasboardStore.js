import { create } from 'zustand';
import { fetchDashboardEventData } from '../api/dashboardApi.js';

const useDashboardStore = create((set) => ({
  eventData: null,
  loading: true,
  error: null,

  fetchEventData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDashboardEventData();
      set({ eventData: data, loading: false });
    } catch (error) {
      console.error('[Dashboard Fetch Error]:', error);
      set({ error: 'Failed to fetch data', loading: false });
    }
  },
}));

export default useDashboardStore;
