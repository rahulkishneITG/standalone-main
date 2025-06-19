import axios from 'axios';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const fetchDashboardEventData = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}api/event/count`,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};
