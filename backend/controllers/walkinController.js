const walk = require('../models/walk_in.model.js');
const { getWalkinWithEventDetails } = require('../services/walkin.services.js');

exports.walkinList = async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'event_name',
      order = 'asc',
    } = req.query;
  
    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };
  
    try {
      const query = search
        ? { event_name: { $regex: search, $options: 'i' } }
        : {};
  
      const [walkinList, total] = await Promise.all([
        walk.find(query).sort(sortOptions).skip(skip).limit(Number(limit)),
        walk.countDocuments(query),
      ]);
  
      res.status(200).json({
        data: walkinList,
        total,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

  exports.walkInData = async (req, res) => {
    const walkinID = req.params.walkinId;

    try {
      const result = await getWalkinWithEventDetails(walkinID);
      res.status(200).json({ data: result });
    } catch (error) {
      const status = error.message === 'Walk-in not found' ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  };