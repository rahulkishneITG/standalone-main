import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/walkin`;
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