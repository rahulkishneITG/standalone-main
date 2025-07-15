import axios from 'axios';
const BASE_URL = `${process.env.REACT_APP_BASE_URL}api`;
export const sendEmail = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/send-email`, formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response.data;
    } catch (error) {
        console.error("Axios error:", error);
        throw new Error('Error sending email: ' + error.response?.data?.message || error.message);
    }
};

