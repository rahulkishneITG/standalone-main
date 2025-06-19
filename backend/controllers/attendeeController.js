const attendeeService = require('../services/attendeeService.js');  


exports.getAttendeeList = async (req, res) => {
  try {
    const data = await attendeeService.getAttendeeList(req.query);
    res.json(data);
  } catch (error) {
    console.error('Error in getAttendeeList:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
