const Attendee = require('../models/attendee.model.js');
const { getAttendeeList, createAttendeeService }  = require('../services/attendeeService.js');
const exportToCSV = require('../utils/csvExporter.js');

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

exports.exportAttendees = async (req, res) => {
  try {
    const attendees = await Attendee.find({}, 'name email').lean();
    const csv = exportToCSV(attendees, ['name', 'email']);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendees.csv');
    res.status(200).send(csv);
  } catch (err) {
    console.error('Error exporting CSV:', err);
    res.status(500).json({ message: 'Failed to export attendees' });
  }
};