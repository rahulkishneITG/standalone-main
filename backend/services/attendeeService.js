const Attendee = require('../models/attendee.model.js');

exports.getAttendeeList = async (queryParams = {}) => {
  const {
    search = '',
    event_id,
    registration_type,
    is_paid,
    from_date,
    to_date
  } = queryParams;

  const filters = [];

  if (search) {
    filters.push({
      $or: [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ]
    });
  }

  if (event_id && mongoose.Types.ObjectId.isValid(event_id)) {
    filters.push({ event_id });
  }


  if (registration_type) {
    filters.push({ registration_type });
  }


  if (is_paid === 'true' || is_paid === 'false') {
    filters.push({ is_paid: is_paid === 'true' });
  }


  if (from_date || to_date) {
    const dateFilter = {};
    if (from_date) {
      dateFilter.$gte = new Date(from_date);
    }
    if (to_date) {
      dateFilter.$lte = new Date(to_date);
    }
    filters.push({ registered_at: dateFilter });
  }


  const query = filters.length ? { $and: filters } : {};


  const allAttendees = await Attendee.find(query);
  const attendeeMap = Object.fromEntries(
    allAttendees.map(att => [att._id.toString(), att])
  );

  const buildAttendeeData = ({
    _id,
    name,
    email,
    registration_type,
    shopify_order_id,
    shopify_product_id,
    is_paid,
    amount_paid,
    registered_at,
    group_id = '',
    isGroupLeader = false,
    hasGroupLeader = false,
    groupLeaderId = null,
    groupLeaderName = null
  }) => ({
    _id,
    name,
    email,
    registration_type,
    shopify_order_id,
    shopify_product_id,
    is_paid,
    amount_paid,
    registered_at,
    group_id,
    isGroupLeader,
    hasGroupLeader,
    groupLeaderId,
    groupLeaderName
  });

  const result = [];

  for (const attendee of allAttendees) {
    const attendeeId = attendee._id.toString();

 
    if (Array.isArray(attendee.group_member_details) && attendee.group_member_details.length > 0) {

      result.push(buildAttendeeData({
        ...attendee._doc,
        isGroupLeader: true
      }));


      for (const member of attendee.group_member_details) {
        result.push(buildAttendeeData({
          _id: null,
          name: member.name,
          email: member.email,
          registration_type: attendee.registration_type,
          shopify_order_id: attendee.shopify_order_id,
          shopify_product_id: attendee.shopify_product_id,
          is_paid: attendee.is_paid,
          amount_paid: attendee.amount_paid,
          registered_at: attendee.registered_at,
          group_id: attendeeId,
          isGroupLeader: false,
          hasGroupLeader: true,
          groupLeaderId: attendeeId,
          groupLeaderName: attendee.name
        }));
      }
    }
    
    else if (attendee.group_id && attendee.group_id !== '') {
      const leader = attendeeMap[attendee.group_id];
      result.push(buildAttendeeData({
        ...attendee._doc,
        isGroupLeader: false,
        hasGroupLeader: true,
        groupLeaderId: leader ? leader._id : null,
        groupLeaderName: leader ? leader.name : null
      }));
    }

    else {
      result.push(buildAttendeeData({
        ...attendee._doc,
        isGroupLeader: false
      }));
    }
  }

  return {
    total: result.length,
    attendees: result
  };
};





