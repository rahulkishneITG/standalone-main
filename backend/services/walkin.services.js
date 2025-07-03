// services/walkin.service.js
const walk = require('../models/walk_in.model.js');
const Event = require('../models/events.model.js');

exports.getWalkinWithEventDetails = async (walkinID) => {
  console.log('Fetching walkin with event details for ID:', walkinID);
  const walkinData = await walk.findById(walkinID);
  if (!walkinData) {
    throw new Error('Walk-in not found');
  }

  let eventDetails = null;

  if (walkinData.event_id) {
    const event = await Event.findById(walkinData.event_id);
    if (event) {
      eventDetails = {
        title: event.name,
        description: event.description,
        walkin_price: parseFloat(event.pricing_walk_in?.toString()),
        imageUrl: event.image_url,
      };
    }
  }

  return {
    ...walkinData._doc,
    event_details: eventDetails,
  };
};
