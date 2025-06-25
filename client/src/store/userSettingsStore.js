import { create } from 'zustand';
import { updateUserPassword } from '../api/userApi';

const useUserSettingsStore = create((set) => ({
  passwordLoading: false,
  passwordMessage: '',
  setPasswordMessage: (msg) => set({ passwordMessage: msg }),

  updatePassword: async ({ currentPassword, newPassword }) => {
    set({ passwordLoading: true, passwordMessage: '' });

    try {
      const res = await updateUserPassword({ currentPassword, newPassword });
      set({ passwordMessage: res.message });
    } catch (err) {
      set({
        passwordMessage:
          err.response?.data?.message || err.message || 'Something went wrong',
      });
    } finally {
      set({ passwordLoading: false });
    }
  },
}));

export default useUserSettingsStore;
