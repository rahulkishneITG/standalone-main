import axios from 'axios';
const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/event`;
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const fetchShopifyProducts = async (search) => {
  const res = await axios.get(`${BASE_URL}/syncproduct?q=${search}`,{
    headers: getAuthHeaders(),
  });
  console.log(res.data.products)
  return res.data.products 
};
