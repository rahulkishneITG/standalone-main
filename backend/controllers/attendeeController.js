const attendeeService = require('../services/attendeeService.js');
const { createAttendeeService } = require('../services/attendee.services');


exports.getAttendeeList = async (req, res) => {
  try {
    console.log(">>> Incoming queryParams:", req.query);
    const data = await attendeeService.getAttendeeList(req.query);
    console.log('data', data);
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
