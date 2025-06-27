const walk = require('../models/walk_in.model.js');

exports.walkinList = async (req, res) => {
    try {
        console.log('Fetching walk-in list...');
        const walkinList = await walk.find();
        console.log('walkinList:', walkinList);
        res.status(200).json({ success: true, data: walkinList });
    } catch (error) {
        console.error('Error fetching walk-in list:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


exports.walkInData = async (req,res) => {
    const walkinID = req.param;
    console.log('walkinId',walkinID);
}
