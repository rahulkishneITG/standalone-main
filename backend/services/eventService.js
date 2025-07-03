const Events = require('../models/events.model.js');
const Attendee = require('../models/attendee.model.js');
const GroupAttendee = require('../models/groupmember.model.js');
const WalkInEvent = require('../models/walk_in.model.js');

const getPaginatedEvents = async ({ page, limit, search, sortBy, order }) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === 'asc' ? 1 : -1;

  const query = search
    ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
      ],
    }
    : {};

  const [events, total] = await Promise.all([
    Events.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Events.countDocuments(query),
  ]);

  console.log('Event', Events);

  return { events, total };
};
// const getPaginatedEvents = async ({ page, limit, search, sortBy, order }) => {
//   const skip = (parseInt(page) - 1) * parseInt(limit);
//   const sortOrder = order === 'asc' ? 1 : -1;

//   const query = search
//     ? {
//         $or: [
//           { name: { $regex: search, $options: 'i' } },
//           { location: { $regex: search, $options: 'i' } },
//           { status: { $regex: search, $options: 'i' } },
//           { event_date: { $regex: search, $options: 'i' } }, // if string
//           { max_capacity: { $regex: search, $options: 'i' } }, // cast to string
//           { pre_registration_capacity: { $regex: search, $options: 'i' } },
//           { walk_in_capacity: { $regex: search, $options: 'i' } },
//         ],
//       }
//     : {};

//   // 👇 Convert number fields safely to string for regex match (if needed)
//   const transformQuery = () => {
//     const regex = new RegExp(search, 'i');
//     return {
//       $or: [
//         { name: regex },
//         { location: regex },
//         { status: regex },
//         { event_date: regex },
//         { max_capacity: { $toString: '$max_capacity' } }, // if aggregation used
//         { pre_registration_capacity: { $toString: '$pre_registration_capacity' } },
//         { walk_in_capacity: { $toString: '$walk_in_capacity' } },
//       ],
//     };
//   };

//   const [events, total] = await Promise.all([
//     Events.find(query)
//       .sort({ [sortBy]: sortOrder })
//       .skip(skip)
//       .limit(parseInt(limit))
//       .lean(),
//     Events.countDocuments(query),
//   ]);

//   return { events, total };
// };


async function countGroupMembers(attendees) {
  let total = 0;
  if (!Array.isArray(attendees)) return total;

  for (const attendee of attendees) {
    if (attendee.group_id) {
      const group = await GroupAttendee.findById(attendee.group_id);
      if (group?.group_member_details && Array.isArray(group.group_member_details)) {
        total += group.group_member_details.length;
      }
    }
  }
  return total;
}

async function getEventCountData() {
  try {
    const [
      countEvent,
      countWalkinAttendee,
      countPreAttendee,
      prePriceResult,
      walkinPriceResult,
      walkinAttendees,
      preAttendees
    ] = await Promise.all([
      Events.countDocuments(),
      Attendee.countDocuments({ registration_as: "walk-in" }),
      Attendee.countDocuments({ registration_as: "pre" }),
      Events.aggregate([
        { $group: { _id: null, totalPreprice: { $sum: "$pricing_pre_registration" } } }
      ]),
      Events.aggregate([
        { $group: { _id: null, totalWalkinPrice: { $sum: "$pricing_walk_in" } } }
      ]),
      Attendee.find({ registration_as: "walk-in" }),
      Attendee.find({ registration_as: "pre" })
    ]);


    const totalPreprice = Number(prePriceResult?.[0]?.totalPreprice || 0);
    const totalWalkinPrice = Number(walkinPriceResult?.[0]?.totalWalkinPrice || 0);
    const totalPrice = totalPreprice + totalWalkinPrice;


    if (!Array.isArray(walkinAttendees) || !Array.isArray(preAttendees)) {
      throw new Error('Invalid attendee data');
    }

    const [totalGroupmemberwalkinCount, totalGroupmemberpreCount] = await Promise.all([
      countGroupMembers(walkinAttendees),
      countGroupMembers(preAttendees)
    ]);

    const onlineCount = countPreAttendee + totalGroupmemberpreCount;
    const walk_in = countWalkinAttendee + totalGroupmemberwalkinCount;
    const total = onlineCount + walk_in;

    return {
      Total_events: countEvent,
      Online_count: onlineCount,
      Walkin: walk_in,
      TotalRegister: total,
      TotalPrePrice: totalPreprice,
      TotalWalkinPrice: totalWalkinPrice,
      TotalRevenu: totalPrice
    };
  } catch (error) {
    console.error('Error in getEventCountData:', error.message);
    throw new Error('Failed to fetch event count data');
  }
}

const createEventService = async (data) => {
  try {
    const {
      name,
      status = 'active',
      draftStatus = false,
      event_date,
      event_time,
      location,
      max_capacity = 0,
      walk_in_capacity = 0,
      pre_registration_capacity = 0,
      pre_registration_start,
      pre_registration_end,
      description = '',
      allow_group_registration = false,
      enable_marketing_email = false,
      pricing_pre_registration = 0,
      pricing_walk_in = 0,
      image_url = '',
      shopify_product_id = '',
      shopify_product_title='',
      created_by
    } = data;


    const requiredFields = { name, event_date, event_time, location, created_by };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) return { error: `Missing required field: ${field}` };
    }

  
    const isValidDate = (d) => d && !isNaN(new Date(d).getTime());
    if (!isValidDate(event_date)) return { error: 'Invalid event_date format' };
    if (pre_registration_start && !isValidDate(pre_registration_start)) {
      return { error: 'Invalid pre_registration_start format' };
    }
    if (pre_registration_end && !isValidDate(pre_registration_end)) {
      return { error: 'Invalid pre_registration_end format' };
    }

  
    const nonNegativeCheck = [
      { field: 'max_capacity', value: max_capacity },
      { field: 'walk_in_capacity', value: walk_in_capacity },
      { field: 'pre_registration_capacity', value: pre_registration_capacity },
      { field: 'pricing_pre_registration', value: pricing_pre_registration },
      { field: 'pricing_walk_in', value: pricing_walk_in }
    ];
    for (const { field, value } of nonNegativeCheck) {
      if (value < 0) return { error: `${field} must be a non-negative number` };
    }

   
    const event = new Events({
      name,
      status,
      draftStatus,
      event_date,
      event_time,
      location,
      max_capacity,
      walk_in_capacity,
      pre_registration_capacity,
      pre_registration_start,
      pre_registration_end,
      description,
      allow_group_registration,
      enable_marketing_email,
      pricing_pre_registration,
      pricing_walk_in,
      image_url,
      shopify_product_id,
      shopify_product_title,
      created_by
    });

 
    const now = new Date();
    const eventDate = new Date(event_date);
    event.status = now > eventDate ? 'past' : 'upcoming';

    await event.save();

    
    if (walk_in_capacity && walk_in_capacity > 0) {
      const walkIn = new WalkInEvent({
        event_id: event._id,
        event_name: event.name,
        event_date: event.event_date,
        walk_in_capacity: event.walk_in_capacity,
        remainingWalkInCapacity:event.walk_in_capacity,
        pricing_walk_in: event.pricing_walk_in
      });

      await walkIn.save();
    }

    return { event };
  } catch (err) {
    console.error('Service error:', err);
    throw err;
  }
};

const getEventByIdService = async (eventId) => {
  return await Events.findById(eventId);
};

const updateEvent = async (updateId, data) => {
    if (!updateId) {
        throw new Error('Update ID is required');
    }

    if (!data || Object.keys(data).length === 0) {
        throw new Error('Update data is required');
    }

    const now = new Date();
    const eventDate = new Date(data.event_date);
    data.status = now > eventDate ? 'past' : 'upcoming';

    const updatedEvent = await Events.findByIdAndUpdate(
        updateId,
        { $set: data },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedEvent) {
        throw new Error('Event not found');
    }

    return updatedEvent;
};




module.exports = { getEventCountData, getPaginatedEvents, createEventService, getEventByIdService, updateEvent };