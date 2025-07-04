const Attendee = require('../models/attendee.model.js');

exports.getPaginatedEmail = async ({ page, limit, search, sortBy, order }) => {
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;
    const query = {
        permission: true,
        $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ]
    };

    const [events, total] = await Promise.all([
        Attendee.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(Number(limit)),
        Attendee.countDocuments(query)
    ]);

    return { events, total };
};
