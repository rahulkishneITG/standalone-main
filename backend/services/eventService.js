const Events = require('../models/events.model.js');

exports.getEventList = async () => {
    try {
        const events = await Events.find().lean();
        return events;
    } catch (err) {
        throw err;
    }
};
