const Attendee = require('../models/attendee.model.js');
const { buildFilters } = require('../utils/attendeeFilter.js');
const normalizeQueryParams = require('../utils/normalizeQuery.js');
const EventGroup = require('../models/groupmember.model.js');
const Walk_in = require('../models/walk_in.model.js');

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

const getAttendeeList = async (queryParams = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = 'name',
    direction = 'asc',
  } = queryParams;

  const normalizedParams = normalizeQueryParams(queryParams);

  const mongoQuery = buildFilters(normalizedParams);


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

const createAttendeeService = async (data) => {
  try {
    const additionalGuestsLength = data?.additional_guests?.length || 0;
    let savedEventGroup = null;
    let type = 'Individual';

    // const event_id = data.event_id;
    const event_id = "6862686d5d6763ec03d5ebb5";

    const countWalkInAttendees = async () => {
      try {
        if (!event_id) {
          throw new Error('Event ID is required');
        }
        const walkInCount = await Attendee.countDocuments({
          event_id: event_id,
          registration_as: "walk-in"
        });

        const walkInRecord = await Walk_in.findOne({ event_id: event_id });
        if (!walkInRecord) {
          throw new Error(`Walk-in capacity record not found for event ${event_id}`);
        }
        const capacity = walkInRecord.walk_in_capacity || 0; // Ensure field exists
      
        const remainingWalkInCapacity = Math.max(0, capacity - walkInCount);
      
        const updatedWalkInRecord = await Walk_in.findOneAndUpdate(
          { event_id: event_id },
          {
            $set: {
              walk_in_capacity: capacity,
              remainingWalkInCapacity: remainingWalkInCapacity,
              updatedAt: new Date()
            }
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          }
        );

        return {
          event_id,
          walkInCount,
          walkInCapacity: capacity,
          remainingWalkInCapacity,
          walkInRecord: updatedWalkInRecord
        };
      } catch (error) {
        console.error('Error processing walk-in data:', error);
        throw error;
      }
    };

    countWalkInAttendees();

    if (additionalGuestsLength > 0) {
      type = 'Group';
      const groupMemberDetails = data.additional_guests.map(guest => ({
        name: `${guest.first_name || ''} ${guest.last_name || ''}`.trim(),
        email: guest.email || '',
        permission: guest.preferences?.opt_in ?? false,
      }));

      const eventGroup = new EventGroup({
        event_id: data.event_id,
        group_leader_name: `${data.main_guest.first_name || ''} ${data.main_guest.last_name || ''}`.trim(),
        group_leader_email: data.main_guest.email || '',
        group_member_details: groupMemberDetails,
        created_at: new Date(),
        updated_at: new Date(),
      });

      savedEventGroup = await eventGroup.save();
    }

    const mainGuest = new Attendee({
      event_id: data.event_id,
      first_name: data.main_guest.first_name || '',
      last_name: data.main_guest.last_name || '',
      name: `${data.main_guest.first_name || ''} ${data.main_guest.last_name || ''}`.trim(),
      email: data.main_guest.email || '',
      current_chm: data.main_guest.is_chm_patient === 'yes',
      permission: data.main_guest.email_preferences?.opt_in ?? false,
      registration_as: data.main_guest.registration_type || '',
      registration_type: type,
      group_id: savedEventGroup?._id || null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedMainGuest = await mainGuest.save();

    const additionalGuestsPromises = data.additional_guests?.map(async (guest) => {
      const attendee = new Attendee({
        event_id: data.event_id,
        first_name: guest.first_name || '',
        last_name: guest.last_name || '',
        email: guest.email || '',
        name: `${guest.first_name || ''} ${guest.last_name || ''}`.trim(),
        current_chm: guest.preferences?.chm ?? false,
        permission: guest.preferences?.opt_in ?? false,
        registration_as: data.main_guest.registration_type || '',
        registration_type: type,
        attendee_main_id: savedMainGuest._id,
        group_id: savedEventGroup?._id || null,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return attendee.save();
    }) || [];

    const additionalGuests = await Promise.all(additionalGuestsPromises);

    return {
      success: true,
      mainGuest: savedMainGuest,
      eventGroup: savedEventGroup,
      additionalGuests,
    };
  } catch (error) {

    console.error('Error in createAttendeeService:', error);
    throw new Error(`Failed to create attendee: ${error.message}`);
  }
};

module.exports = { getAttendeeList, createAttendeeService };