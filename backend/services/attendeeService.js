const Attendee = require('../models/attendee.model.js');
const { buildFilters } = require('../utils/attendeeFilter.js');
const normalizeQueryParams = require('../utils/normalizeQuery.js');

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
  const {
    page = 1,
    limit = 10,
    sort = 'name',
    direction = 'asc',
  } = queryParams;

  const normalizedParams = normalizeQueryParams(queryParams);
  console.log('Normalized Query Params:', normalizedParams);


  const mongoQuery = buildFilters(normalizedParams); 
  console.log('Mongo Query:', JSON.stringify(mongoQuery, null, 2));

  const safeLimit = Math.max(1, parseInt(limit));
  const safePage = Math.max(1, parseInt(page));
  const skip = (safePage - 1) * safeLimit;

  const sortBy = { [sort]: direction === 'asc' ? 1 : -1 };
  const rawAttendees = await Attendee.find(mongoQuery)
    .sort(sortBy)
    .skip(skip)
    .limit(safeLimit)
    .lean(); 

  const attendeeMap = Object.fromEntries(rawAttendees.map((a) => [a._id.toString(), a]));
  let flatList = [];

  for (const attendee of rawAttendees) {
    const attendeeId = attendee._id.toString();
    const base = { ...attendee };
    if (Array.isArray(attendee.group_member_details) && attendee.group_member_details.length > 0) {

      flatList.push(buildAttendeeData({ ...base, isGroupLeader: true }));

      attendee.group_member_details.forEach((member) => {
        if (mongoQuery.registration_type && !mongoQuery.registration_type.$in.includes(base.registration_type)) {
          return;
        }
        flatList.push(buildAttendeeData({
          ...base,
          _id: null,
          name: member.name,
          email: member.email,
          registration_type: base.registration_type,
          isGroupLeader: false,
          hasGroupLeader: true,
          group_id: attendeeId,
          groupLeaderId: attendeeId,
          groupLeaderName: attendee.name,
        }));
      });
    } else if (attendee.group_id && attendee.group_id !== '') {
      const leader = attendeeMap[attendee.group_id];
      if (!mongoQuery.registration_type || mongoQuery.registration_type.$in.includes(base.registration_type)) {
        flatList.push(buildAttendeeData({
          ...base,
          isGroupLeader: false,
          hasGroupLeader: true,
          groupLeaderId: leader?._id || null,
          groupLeaderName: leader?.name || null,
        }));
      }
    } else {
      if (!mongoQuery.registration_type || mongoQuery.registration_type.$in.includes(base.registration_type)) {
        flatList.push(buildAttendeeData({ ...base, isGroupLeader: false }));
      }
    }
  }
  const total = await Attendee.countDocuments(mongoQuery);

  return {
    total,
    attendees: flatList,
  };
};