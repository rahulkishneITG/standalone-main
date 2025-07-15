
// import axios from 'axios';

// const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/attendees`;
// console.log('BASE_URL', BASE_URL);
// const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem('token')}`,
// });

// export const getAttendeeList = async (params) => {
//     console.log(axios.getUri({
//         url: `${BASE_URL}/getAttendeeList`,
//         params,
//     }));
//     const { data } = await axios.get(`${BASE_URL}/getAttendeeList`, {
//         headers: getAuthHeaders(),
//         params,
//     });
//     console.log('data', data);
//     return data;
// };
// src/api/attendeeApi.js

import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}api/attendees`;

// Optional debug log
console.log('BASE_URL', BASE_URL);

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const fetchAttendeesAPI = async (state) => {
  const params = {
    page: state.currentPage,
    limit: state.itemsPerPage,
    sort: 'name',
    direction: state.sortDirection,
  };

  if (state.query) params.search = state.query;
  if (state.registrationType.length > 0)
    params.registration_type = state.registrationType.join(',');
  if (state.paidStatus.length > 0)
    params.is_paid = state.paidStatus[0] === 'Yes' ? 'yes' : 'no';
  if (state.registeredDate) params.registered_date = state.registeredDate;
  if (state.eventName) params.event_name = state.eventName;

  try {
    const { data } = await axios.get(`${BASE_URL}/getAttendeeList`, {
      headers: getAuthHeaders(),
      params,
    });

    return {
      attendees: Array.isArray(data.attendees) ? data.attendees : [],
      totalAttendees: typeof data.total === 'number' ? data.total : 0,
    };
  } catch (error) {
    console.error('API fetch error:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch attendees.'
    );
  }
};

  