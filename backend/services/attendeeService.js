const Attendee = require('../models/attendee.model.js');

exports.getAttendeeList = async (queryParams) => {
  const {
    search = '',
    page = 1,
    limit = 10,
    registrationType,
    paid,
    registeredDate,
    sort = 'name',
    direction = 'asc',
  } = queryParams;

  const query = {
    $and: [
      {
        $or: [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ]
      },
      registrationType ? { registrationType } : {},
      paid ? { paid } : {},
      registeredDate ? { registeredDate } : {}
    ]
  };

  const sortOption = { [sort]: direction === 'asc' ? 1 : -1 };

  const attendees = await Attendee.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Attendee.countDocuments(query);

  return { attendees, total };
};
