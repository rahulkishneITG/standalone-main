import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/event`;
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

export const getEventList = async ({ page, limit, search, sortBy, order }) => {
  const { data } = await axios.get(`${BASE_URL}/getEventList`, {
    headers: getAuthHeaders(),
    params: { page, limit, search, sortBy, order },
  });
  return data;
};

export const  deleteEventById = async (eventId) => {
  if (!eventId || typeof eventId !== 'string') {
    throw new Error('Invalid or missing event ID');
  }

  try {
    const url = `${BASE_URL}/deletedEvent/${eventId}`;

    const response = await axios.delete(url, {
      headers: getAuthHeaders(),
    });
    console.log('response:', response.data)
    return response.data;
  } catch (error) {
    console.error('[API Delete Error]:', error?.response?.data || error.message);
    throw error; 
  }
};
export const getEditEventData = async (eventId) => {
  console.log(eventId)
  if (!eventId || typeof eventId !== 'string') {
    throw new Error('Invalid or missing event ID');
  }
  try {
    const url = `${BASE_URL}/editEvent/${eventId}`;  
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('[API Error]:', error?.response?.data || error.message);
    throw error; 
  }
};
export const createEvent = async (payload) => {
  const response = await axios.post(`${BASE_URL}/createEvent`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const UpdateEditEventData = async (eventId,payload) => {
  console.log(eventId)
  if (!eventId || typeof eventId !== 'string') {
    throw new Error('Invalid or missing event ID');
  }
  try {
    const url = `${BASE_URL}/updateEventData/${eventId}`;  
    const response = await axios.put(url,payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('[API Error]:', error?.response?.data || error.message);
    throw error; 
  }
};