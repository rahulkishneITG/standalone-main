const { getAttendeeList, createAttendeeService }  = require('../services/attendeeService.js');

exports.getAttendeeList = async (req, res) => {
  try {
    console.log('QueryParameter',req.query);
    const data = await getAttendeeList(req.query);
    console.log('data check', data);
    res.json(data);
  } catch (error) {
    console.error('Error in getAttendeeList:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.createAttendee = async (req, res) => {
  try {
    const result = await createAttendeeService(req.body);
    console.log('result',result);

    return res.status(201).json({
      message: "Group and attendee inserted successfully",
    });

  } catch (err) {
    console.error("Error:", err.message);
    return res.status(400).json({ error: err.message });
  }
};
