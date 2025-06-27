import axios from 'axios';
const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/user`;
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});
export const getUserProfile = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/getuser`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Fetching user profile failed:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const res = await axios.put(`${BASE_URL}/updateuser`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, 
    });
    return res.data;
  } catch (error) {
    console.error('Updating user profile failed:', error.response?.data || error.message);
    throw error;
  }
};


  export const updateUserPassword = async ({ currentPassword, newPassword }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/updatepassword`,
        { currentPassword, newPassword },
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      console.error('Password update failed:', error.response?.data || error.message);
      throw error;
    }
  };
  