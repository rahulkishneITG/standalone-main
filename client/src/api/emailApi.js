
import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/email`;
console.log('BASE_URL', BASE_URL);
const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getEmailList = async (params) => {
    console.log(axios.getUri({
        url: `${BASE_URL}/getEmailList`,
        params,
    }));
    const { data } = await axios.get(`${BASE_URL}/getEmailList`, {
        headers: getAuthHeaders(),
        params,
    });
    console.log('data', data);
    return data;
};