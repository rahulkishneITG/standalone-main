const Attendee = require('../models/attendee.model.js');
const { buildFilters } = require('../utils/attendeeFilter.js');

const buildAttendeeData = (data) => ({
  _id: data._id || null,
  name: data.name,
  email: data.email,
  registration_type: data.registration_type,
  shopify_order_id: data.shopify_order_id,
  shopify_product_id: data.shopify_product_id,
  is_paid: data.is_paid,
  amount_paid: data.amount_paid,
  registered_at: data.registered_at,
  group_id: data.group_id || '',
  isGroupLeader: data.isGroupLeader || false,
  hasGroupLeader: data.hasGroupLeader || false,
  groupLeaderId: data.groupLeaderId || null,
  groupLeaderName: data.groupLeaderName || null,
});

exports.getAttendeeList = async (queryParams = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'name',
      direction = 'asc',
    } = queryParams;

    const mongoQuery = buildFilters(queryParams);
    const sortBy = { [sort]: direction === 'asc' ? 1 : -1 };
    console.log('queryParams', queryParams);
    console.log("🔍 Mongo Query:", JSON.stringify(mongoQuery, null, 2));

    const rawAttendees = await Attendee.find(mongoQuery).sort(sortBy);
    console.log("🧾 Raw attendee count:", rawAttendees.length);
    console.log("🔹 Sample attendee:", rawAttendees[0]);

    const attendeeMap = {};
    rawAttendees.forEach((a) => {
      if (a?._id) {
        attendeeMap[a._id.toString()] = a;
      }
    });

    let flatList = [];

    for (const attendee of rawAttendees) {
      const attendeeId = attendee?._id?.toString?.() || '';
      const base = { ...attendee._doc };

      if (Array.isArray(attendee.group_member_details) && attendee.group_member_details.length > 0) {
        flatList.push(buildAttendeeData({ ...base, isGroupLeader: true }));
        attendee.group_member_details.forEach((member) => {
          flatList.push(buildAttendeeData({
            ...base,
            _id: null,
            name: member.name,
            email: member.email,
            isGroupLeader: false,
            hasGroupLeader: true,
            group_id: attendeeId,
            groupLeaderId: attendeeId,
            groupLeaderName: attendee.name,
          }));
        });
      } else if (attendee.group_id && attendee.group_id !== '') {
        const leader = attendeeMap[attendee.group_id];
        flatList.push(buildAttendeeData({
          ...base,
          isGroupLeader: false,
          hasGroupLeader: true,
          groupLeaderId: leader?._id || null,
          groupLeaderName: leader?.name || null,
        }));
      } else {
        flatList.push(buildAttendeeData({ ...base, isGroupLeader: false }));
      }
    }

    // Pagination
    const safeLimit = Math.max(1, parseInt(limit));
    const safePage = Math.max(1, parseInt(page));
    const start = (safePage - 1) * safeLimit;
    const paginated = flatList.slice(start, start + safeLimit);

    return {
      total: flatList.length,
      attendees: paginated,
    };

  } catch (err) {
    console.error('Error in getAttendeeList:', err);
    throw err; 
  }
};
