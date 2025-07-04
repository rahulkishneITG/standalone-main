import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/walkin`;
const BASE_URL_ATTENDEES = `${process.env.REACT_APP_BASE_URL}api/attendees`;
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

export const getWalkinList = async ({ page, limit, search, sortBy, order }) => {
  const { data } = await axios.get(`${BASE_URL}/walkinList`, {
    headers: getAuthHeaders(),
    params: { page, limit, search, sortBy, order },
  });
  return data;
};

export const getWalkinById = async (id) => {
  console.log('Fetching walkin details for ID:', id);
  console.log('Authorization header:', getAuthHeaders());
  console.log('Base URL:', BASE_URL);
  console.log('Full request URL:', `${BASE_URL}/walkinList/${id}`);

  const res = await axios.get(`${BASE_URL}/walkinList/${id}`, {
    headers: getAuthHeaders(),
  }); 
  console.log('Fetched walkin details:', res.data);
  return res.data;
};

export const submitWalkinForm = async (payload) => {
  const response = await fetch(`${BASE_URL_ATTENDEES}/createAttendee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Walk-in form submission failed');
  }

  return response.json();
};
