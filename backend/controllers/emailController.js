const { getPaginatedEmail } = require("../services/email.services.js");
exports.getEmailList = async (req, res) => {
    try {
    const data = await getPaginatedEmail(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
