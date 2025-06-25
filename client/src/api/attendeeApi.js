
import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/attendees`;
console.log('BASE_URL', BASE_URL);
const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getAttendeeList = async (params) => {
    console.log(axios.getUri({
        url: `${BASE_URL}/getAttendeeList`,
        params,
    }));
    const { data } = await axios.get(`${BASE_URL}/getAttendeeList`, {
        headers: getAuthHeaders(),
        params,
    });
    console.log('data', data);
    return data;
};
