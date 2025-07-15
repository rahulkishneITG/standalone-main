// const Attendee = require('../models/attendee.model.js');

// exports.getPaginatedEmail = async ({ page, limit, search, sortBy, order }) => {
//     const skip = (page - 1) * limit;
//     const sortOrder = order === 'asc' ? 1 : -1;
//     const query = {
//         email_preferences_chm: true,
//         $or: [
//             { name: { $regex: search, $options: 'i' } },
//             { email: { $regex: search, $options: 'i' } }
//         ]
//     };

//     const [events, total] = await Promise.all([
//         Attendee.find(query)
//             .sort({ [sortBy]: sortOrder })
//             .skip(skip)
//             .limit(Number(limit)),
//         Attendee.countDocuments(query)
//     ]);

//     return { events, total };
// };
const mongoose = require('mongoose');
const Attendee = require('../models/attendee.model');
const Events = require('../models/events.model'); // ✅ Make sure it's imported

exports.getPaginatedEmail = async ({ page, limit, search, sortBy, order }) => {
  const skip = (page - 1) * limit;
  const sortOrder = order === 'asc' ? 1 : -1;

  const query = {
    email_preferences_chm: true,
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  };

  const [attendees, total] = await Promise.all([
    Attendee.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit))
      .lean(), 
    Attendee.countDocuments(query)
  ]);

  const updatedAttendees = await Promise.all(
    attendees.map(async (attendee) => {
      let eventName = '';
      if (attendee.event_id) {
        const event = await Events.findById(attendee.event_id).lean();
        eventName = event?.name || '';
      }

      return {
        ...attendee,
        eventName,
      };
    })
  );

  return { events: updatedAttendees, total };
};


