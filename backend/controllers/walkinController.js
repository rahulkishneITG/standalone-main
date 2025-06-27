const walk = require('../models/walk_in.model.js');

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
      console.error('Error fetching walk-in list:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

exports.walkInData = async (req,res) => {
    const walkinID = req.param;
    console.log('walkinId',walkinID);
}
