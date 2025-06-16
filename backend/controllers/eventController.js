const Events = require('../models/events.model.js');
const Attendee = require('../models/attendee.model.js');
const GroupAttendee = require('../models/groupmember.model.js');
const jwt = require('jsonwebtoken');
const Services = require('../services/auth.services.js');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });


exports.createEvent = async (req, res) => {
    try {
        const {
            name,
            status = 'active',
            draftStatus = false,
            event_date,
            event_time,
            location,
            max_capacity = 0,
            walk_in_capacity = 0,
            pre_registration_capacity = 0,
            pre_registration_start,
            pre_registration_end,
            description = '',
            allow_group_registration = false,
            enable_marketing_email = false,
            pricing_pre_registration = 0,
            pricing_walk_in = 0,
            image_url = '',
            shopify_product_id = '',
            created_by
        } = req.body;

        if (!name || !event_date || !event_time) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const result = new Events({
            name,
            status,
            draftStatus,
            event_date,
            event_time,
            location,
            max_capacity,
            walk_in_capacity,
            pre_registration_capacity,
            pre_registration_start,
            pre_registration_end,
            description,
            allow_group_registration,
            enable_marketing_email,
            pricing_pre_registration,
            pricing_walk_in,
            image_url,
            shopify_product_id,
            created_by
        });

        await result.save();
        res.status(200).send("Event Details added");

    } catch (err) {
        console.error('Error saving event:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getEventList = async (req, res) => {
    const cached = cache.get('events');
    if (cached) return res.status(200).json(cached);

    try {
        const events = await Events.find().lean();
        cache.set('events', events);
        res.status(200).json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getEventCount = async (req, res) => {
    try {
        const [
            countEvent,
            countWalkinAttendee,
            countPreAttendee,
            prePriceResult,
            walkinPriceResult,
            walkinAttendees,
            preAttendees
        ] = await Promise.all([
            Events.countDocuments(),
            Attendee.countDocuments({ registration_type: "Walkin" }),
            Attendee.countDocuments({ registration_type: "Pre" }),
            Events.aggregate([
                { $group: { _id: null, totalPreprice: { $sum: "$pricing_pre_registration" } } }
            ]),
            Events.aggregate([
                { $group: { _id: null, totalWalkinPrice: { $sum: "$pricing_walk_in" } } }
            ]),
            Attendee.find({ registration_type: "Walkin" }),
            Attendee.find({ registration_type: "Pre" })
        ]);

        const totalPreprice = Number(prePriceResult[0]?.totalPreprice || 0);
        const totalWalkinPrice = Number(walkinPriceResult[0]?.totalWalkinPrice || 0);
        const totalPrice = totalPreprice + totalWalkinPrice;

        
        const countGroupMembers = async (attendees) => {
            let total = 0;
            for (const attendee of attendees) {
                if (attendee.group_id) {
                    const group = await GroupAttendee.findById(attendee.group_id);
                    if (group?.group_member_details?.length) {
                        total += group.group_member_details.length;
                    }
                }
            }
            return total;
        };

        const [totalGroupmemberwalkinCount, totalGroupmemberpreCount] = await Promise.all([
            countGroupMembers(walkinAttendees),
            countGroupMembers(preAttendees)
        ]);

        const onlineCount = countPreAttendee + totalGroupmemberpreCount;
        const walk_in = countWalkinAttendee + totalGroupmemberwalkinCount;
        const total = onlineCount + walk_in;

        res.status(200).json({
            Total_events: countEvent,
            Online_count: onlineCount,
            Walkin: walk_in,
            TotalRegister: total,
            TotalPrePrice: totalPreprice,
            TotalWalkinPrice: totalWalkinPrice,
            TotalRevenu: totalPrice
        });
    } catch (err) {
        console.error('Error counting events:', err);
        res.status(500).json({ error: 'Failed to count events' });
    }
};

