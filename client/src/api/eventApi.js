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

export const deleteEventById = async (eventId) => {
  await axios.delete(`${BASE_URL}/deleteEvent/${eventId}`, {
    headers: getAuthHeaders(),
  });
};
