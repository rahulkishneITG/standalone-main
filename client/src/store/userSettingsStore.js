import { create } from 'zustand';
import { getUserProfile, updateUserProfile, updateUserPassword } from '../api/userApi';

export const useUserSettingsStore = create((set) => ({
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

export const useUserProfileStore = create((set) => ({
  userProfile: null,
  profileLoading: false,
  profileMessage: '',
  updateSuccess: false,

  setProfileMessage: (msg) => set({ profileMessage: msg }),

  fetchUserProfile: async () => {
    set({ profileLoading: true, profileMessage: '', updateSuccess: false });
    try {
      const data = await getUserProfile();
      set({ userProfile: data });
    } catch (err) {
      set({
        profileMessage:
          err.response?.data?.message || err.message || 'Something went wrong while fetching profile',
      });
    } finally {
      set({ profileLoading: false });
    }
  },

  updateUserProfile: async (payload) => {
    set({ profileLoading: true, profileMessage: '', updateSuccess: false });
    try {
      const res = await updateUserProfile(payload);
      set({
        userProfile: res.data || payload,
        profileMessage: res.message || 'Profile updated successfully.',
        updateSuccess: true,
      });
    } catch (err) {
      set({
        profileMessage:
          err.response?.data?.message || err.message || 'Something went wrong while updating profile',
        updateSuccess: false,
      });
    } finally {
      set({ profileLoading: false });
    }
  },
}));