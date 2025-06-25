import axios from 'axios';
const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/user`;
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getUserProfile = async () => {
    return {
      name: 'Rahul Kishne',
      email: 'rahul@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=3',
    };
  };
  
  export const updateUserProfile = async (payload) => {
    console.log('Updated:', payload);
  };

export const updateUserPassword = async ({ currentPassword, newPassword }) => {
  const res = await axios.post(
    `${BASE_URL}/update-password`,
    { currentPassword, newPassword },
    { headers: getAuthHeaders() }
  );
  return res.data;
};
