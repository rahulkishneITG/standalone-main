const EventGroup = require('../models/groupmember.model.js');
const Attendee = require('../models/attendee.model.js');

exports.createAttendeeService = async (data) => {

  if (!data.main_guest?.first_name || !data.main_guest?.last_name || !data.main_guest?.email) {
    throw new Error('Main guest details are incomplete.');
  }

  if (!Array.isArray(data.additional_guests)) {
    throw new Error('Additional guests must be an array.');
  }

 
  const groupMembers = data.additional_guests.map(g => ({
    name: `${g.first_name} ${g.last_name}`,
    email: g.email,
    permission: g.permission || '',
    ...g
  }));


  const groupDoc = new EventGroup({
    event_id: data.event_id || 'default_event',
    group_leader_name: `${data.main_guest.first_name} ${data.main_guest.last_name}`,
    group_leader_email: data.main_guest.email,
    group_member_details: groupMembers
  });
  const savedGroup = await groupDoc.save();

  
  const attendeeGroupMembers = data.additional_guests.map(g => ({
    group_first_name: g.first_name,
    group_last_name: g.last_name,
    group_email: g.email,
    permission: g.permission || '',
    ...g
  }));


  const attendeeDoc = new Attendee({
    event_id: data.event_id || 'default_event',
    first_name: data.main_guest.first_name,
    last_name: data.main_guest.last_name,
    email: data.main_guest.email,
    group_member_details: attendeeGroupMembers,
    registration_type: data.registration_type || 'general',
    is_paid: data.is_paid || 'no',
    amount_paid: parseFloat(data.amount_paid) || 0.00,
    group_id: savedGroup._id.toString(),
    source: data.source || '',
    shopify_order_id: data.shopify_order_id || '',
    shopify_product_id: data.shopify_product_id || ''
  });

  const savedAttendee = await attendeeDoc.save();

  return {
    group_id: savedGroup._id,
    attendee_id: savedAttendee._id
  };
};

