const { getAttendeeList, createAttendeeService }  = require('../services/attendeeService.js');

exports.getAttendeeList = async (req, res) => {
  try {
    const data = await getAttendeeList(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.createAttendee = async (req, res) => {
  try {
    const result = await createAttendeeService(req.body);
    return res.status(201).json({
      message: "Group and attendee inserted successfully",
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
