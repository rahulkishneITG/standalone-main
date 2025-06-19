const Events = require('../models/events.model.js');  

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

  return { events, total };
};

module.exports = {
  getPaginatedEvents,
};
