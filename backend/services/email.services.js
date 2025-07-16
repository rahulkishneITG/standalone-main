const Attendee = require('../models/attendee.model.js');
const { buildFilters } = require('../utils/attendeeFilter.js');
const normalizeQueryParams = require('../utils/normalizeemail.js');
const EventGroup = require('../models/groupmember.model.js');
const Events = require('../models/events.model.js');
const Walk_in = require('../models/walk_in.model.js');
const { default: mongoose } = require('mongoose');

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
  eventName: data.eventName || null,
});

const getPaginatedEmail = async (queryParams = {}) => {
  
  const {
    page = 1,
    limit = 10,
    sort = 'name',
    direction = 'asc',
    event_name = '',
  } = queryParams;

  const normalizedParams = normalizeQueryParams(queryParams);
  const mongoQuery = buildFilters(normalizedParams);

  mongoQuery.email_preferences_chm = true;

  if (queryParams.registered_date) {
    const date = new Date(queryParams.registered_date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    mongoQuery.registered_at = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  const safeLimit = Math.max(1, parseInt(limit));
  const safePage = Math.max(1, parseInt(page));
  const skip = (safePage - 1) * safeLimit;
  const sortBy = { [sort]: direction === 'asc' ? 1 : -1 };

  const allMatchingAttendees = await Attendee.find(mongoQuery)
    .sort(sortBy)
    .lean();

  const eventIds = [...new Set(allMatchingAttendees.map(a => a.event_id).filter(Boolean))];
  const events = await Events.find({ _id: { $in: eventIds } }).lean();
  const eventMap = Object.fromEntries(events.map(e => [e._id.toString(), e.name]));

  let flatList = [];

  for (const attendee of allMatchingAttendees) {
    const attendeeId = attendee._id.toString();
    const base = { ...attendee };
    const eventId = attendee.event_id?.toString();
    const eventName = eventMap[eventId] || '';

    if (event_name && !eventName.toLowerCase().includes(event_name.toLowerCase())) {
      continue;
    }

    if (Array.isArray(attendee.group_member_details) && attendee.group_member_details.length > 0) {
      flatList.push(buildAttendeeData({ ...base, isGroupLeader: true, eventName }));

      attendee.group_member_details.forEach((member) => {
        if (mongoQuery.registration_type && !mongoQuery.registration_type.$in.includes(base.registration_type)) return;

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
          eventName,
        }));
      });
    } else if (attendee.group_id && attendee.group_id !== '') {
      const leader = allMatchingAttendees.find(a => a._id.toString() === attendee.group_id);
      if (!mongoQuery.registration_type || mongoQuery.registration_type.$in.includes(base.registration_type)) {
        flatList.push(buildAttendeeData({
          ...base,
          isGroupLeader: false,
          hasGroupLeader: true,
          groupLeaderId: leader?._id || null,
          groupLeaderName: leader?.name || null,
          eventName
        }));
      }
    } else {
      if (!mongoQuery.registration_type || mongoQuery.registration_type.$in.includes(base.registration_type)) {
        flatList.push(buildAttendeeData({ ...base, isGroupLeader: false, eventName }));
      }
    }
  }

  const total = flatList.length;
  const paginatedAttendees = flatList.slice(skip, skip + safeLimit);

  return {
    total,
    attendees: paginatedAttendees,
  };
};

module.exports = { getPaginatedEmail };