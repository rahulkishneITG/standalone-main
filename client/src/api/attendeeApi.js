
import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/attendees`;
console.log('BASE_URL', BASE_URL);
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    console.log("Auth Token being sent:", token); // 🔍 DEBUG
    return {
      Authorization: `Bearer ${token}`,
    };
  };
  

export const getAttendeeList = async (params) => {
    console.log('params', params);
    const { data } = await axios.get(`${BASE_URL}/getAttendeeList`, {
        headers: getAuthHeaders(),
        params,
    });
    console.log('data', data);
    return data;
};
