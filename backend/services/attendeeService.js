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
    let type = additionalGuestsLength > 0 ? 'Group' : 'Individual';

    const event_id = data.event_id;
    const registrationType = data.registration_type;
    const status = registrationType === 'walkin' ? true : false;
    
    if (!event_id) throw new Error('Event ID is required');

    

    // Save Event Group if applicable
    if (additionalGuestsLength > 0) {
      const groupMemberDetails = data.additional_guests.map(guest => ({
        name: `${guest.first_name || ''} ${guest.last_name || ''}`.trim(),
        email: guest.email || '',
        preferences_chm: guest.preferences?.chm ?? false,
        preferences_dr_brownstein: guest.preferences?.dr_brownstein ?? false,
        preferences_opt_in: guest.preferences?.opt_in ?? false,
      }));

      const eventGroup = new EventGroup({
        event_id,
        group_leader_name: `${data.main_guest.first_name || ''} ${data.main_guest.last_name || ''}`.trim(),
        group_leader_email: data.main_guest.email || '',
        group_member_details: groupMemberDetails,
        created_at: new Date(),
        updated_at: new Date(),
      });

      savedEventGroup = await eventGroup.save();
    }
    // Save Main Guest
    const savedMainGuest = await new Attendee({
      event_id,
      first_name: data.main_guest.first_name || '',
      last_name: data.main_guest.last_name || '',
      name: `${data.main_guest.first_name || ''} ${data.main_guest.last_name || ''}`.trim(),
      email: data.main_guest.email || '',
      is_chm_patient: data.is_chm_patient ||'',
      email_preferences_chm: data.main_guest.email_preferences?.chm ?? false,
      email_preferences_dr_brownstein: data.main_guest.email_preferences?.dr_brownstein ?? false,
      email_preferences_opt_in: data.main_guest.email_preferences?.opt_in ?? false,
      registration_as: registrationType || '', 
      is_paid: status,
      registration_type: type,
      group_id: savedEventGroup?._id || null,
      created_at: new Date(),
      updated_at: new Date(),
    }).save();

    // Save Additional Guests
    const additionalGuestsPromises = (data.additional_guests || []).map(async (guest) => {
      return new Attendee({
        event_id,
        first_name: guest.first_name || '',
        last_name: guest.last_name || '',
        name: `${guest.first_name || ''} ${guest.last_name || ''}`.trim(),
        email: guest.email || '',
        email_preferences_chm: guest.preferences?.chm ?? false,
        email_preferences_dr_brownstein: guest.preferences?.opt_in ?? false,
        email_preferences_opt_in: guest.preferences?.opt_in ?? false,
        registration_as: registrationType || '', 
        is_paid: status,
        registration_type: type,
        attendee_main_id: savedMainGuest._id,
        group_id: savedEventGroup?._id || null,
        created_at: new Date(),
        updated_at: new Date(),
      }).save();
    });

    const additionalGuests = await Promise.all(additionalGuestsPromises);
    const countWalkInAttendees = async () => {
      const walkInCount = await Attendee.countDocuments({
        event_id,
        registration_as: "walkin"
      });

      const walkInRecord = await Walk_in.findOne({ event_id });
      if (!walkInRecord) {
        throw new Error(`Walk-in capacity record not found for event ${event_id}`);
      }

      const capacity = walkInRecord.walk_in_capacity || 0;
      const remainingWalkInCapacity = Math.max(0, capacity - walkInCount);

      if (remainingWalkInCapacity <= 0) {
        throw new Error("Walk-in capacity is full");
      }

      const updatedWalkInRecord = await Walk_in.findOneAndUpdate(
        { event_id },
        {
          $set: {
            walk_in_capacity: capacity,
            remainingWalkInCapacity,
            updatedAt: new Date()
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return { walkInCount, capacity, remainingWalkInCapacity, walkInRecord: updatedWalkInRecord };
    };
   
    await countWalkInAttendees(); 
    return {
      success: true,
      mainGuest: savedMainGuest,
      eventGroup: savedEventGroup,
      additionalGuests,
    };
  } catch (error) {

    throw new Error(`Failed to create attendee: ${error.message}`);
  }
};


module.exports = { getAttendeeList, createAttendeeService };