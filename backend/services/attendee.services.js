const EventGroup = require('../models/groupmember.model.js');
const Attendee = require('../models/attendee.model.js');

exports.createAttendeeService = async (data) => {
  // Step 1: Validate main guest
  if (!data.main_guest?.first_name || !data.main_guest?.last_name || !data.main_guest?.email) {
    throw new Error('Main guest details are incomplete.');
  }

  const hasGroupMembers = Array.isArray(data.additional_guests) && data.additional_guests.length > 0;

  // Common fields
  const event_id = data.event_id || 'default_event';
  const registration_type = data.registration_type || 'general';
  const registration_as = data.registration_as || 'individual';
  const is_paid = data.is_paid || 'no';
  const amount_paid = parseFloat(data.amount_paid) || 0.00;
  const source = data.source || '';
  const shopify_order_id = data.shopify_order_id || '';
  const shopify_product_id = data.shopify_product_id || '';

  let savedGroup = null;
  let groupMemberIds = [];

  if (hasGroupMembers) {
    // Step 2: If group members present, create group
    const groupLeaderName = `${data.main_guest.first_name} ${data.main_guest.last_name}`;

    const groupDoc = new EventGroup({
      event_id,
      group_leader_name: groupLeaderName,
      group_leader_email: data.main_guest.email,
      group_member_details: data.additional_guests.map(g => ({
        group_first_name: g.first_name,
        group_last_name: g.last_name,
        group_email: g.email,
        permission: g.permission === true || g.permission === 'yes'
      }))
    });

    savedGroup = await groupDoc.save();

    // Step 3: Save main guest with group_id
    const mainAttendee = new Attendee({
      event_id,
      first_name: data.main_guest.first_name,
      last_name: data.main_guest.last_name,
      name: `${data.main_guest.first_name} ${data.main_guest.last_name}`,
      email: data.main_guest.email,
      registration_type,
      registration_as,
      is_paid,
      amount_paid,
      group_id: savedGroup._id.toString(),
      source,
      shopify_order_id,
      shopify_product_id
    });

    const savedMainAttendee = await mainAttendee.save();

    // Step 4: Save each group member as attendee
    for (const guest of data.additional_guests) {
      const groupMemberAttendee = new Attendee({
        event_id,
        first_name: guest.first_name,
        last_name: guest.last_name,
        name: `${guest.first_name} ${guest.last_name}`,
        email: guest.email,
        permission: guest.permission === true || guest.permission === 'yes',
        registration_type,
        registration_as,
        is_paid,
        amount_paid,
        group_id: savedGroup._id.toString(),
        group_leader_name: groupLeaderName,
        source,
        shopify_order_id,
        shopify_product_id
      });

      const savedMember = await groupMemberAttendee.save();
      groupMemberIds.push(savedMember._id);
    }

    return {
      message: 'Main attendee and group members saved',
      group_id: savedGroup._id,
      main_attendee_id: savedMainAttendee._id,
      group_member_attendee_ids: groupMemberIds
    };
  } else {
    // Step 5: No group members → insert only main attendee
    const mainAttendee = new Attendee({
      event_id,
      first_name: data.main_guest.first_name,
      last_name: data.main_guest.last_name,
      name: `${data.main_guest.first_name} ${data.main_guest.last_name}`,
      email: data.main_guest.email,
      registration_type,
      registration_as,
      is_paid,
      amount_paid,
      source,
      shopify_order_id,
      shopify_product_id
    });

    const savedMainAttendee = await mainAttendee.save();

    return {
      message: 'Only main attendee saved (no group)',
      main_attendee_id: savedMainAttendee._id
    };
  }
};
