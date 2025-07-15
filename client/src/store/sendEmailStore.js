import {create} from 'zustand';

const useSendEmailStore = create((set) => ({
    to: '',
    subject: '',
    text: '',
    html: '',

    setFormData: (key, value) => set((state) => ({ ...state, [key]: value })),

    resetForm: () => set(() => ({
        to: '',
        subject: '',
        text: '',
        html: ''
    }))
}));

export default useSendEmailStore;
