import { create } from 'zustand';

const useEventStore = create((set) => ({
  eventData: {
    name: '',
    dateTime: '',
    location: '',
    maxCapacity: '',
    walkInSlot: '',
    closingDate: '',
    description: '',
    groupRegistration: false,
    collectEmails: false,
    prePrice: '',
    walkInPrice: '',
    product: null,
    shopifyProductId: '',
  },
  setField: (key, value) =>
    set((state) => ({
      eventData: { ...state.eventData, [key]: value },
    })),

  setMultipleFields: (fields) =>
    set((state) => ({
      eventData: { ...state.eventData, ...fields },
    })),

  resetEventForm: () =>
    set(() => ({
      eventData: {
        name: '',
        dateTime: '',
        location: '',
        maxCapacity: '',
        walkInSlot: '',
        closingDate: '',
        description: '',
        groupRegistration: false,
        collectEmails: false,
        prePrice: '',
        walkInPrice: '',
        product: null,
        shopifyProductId: '',
      },
    })),
}));

export default useEventStore;
