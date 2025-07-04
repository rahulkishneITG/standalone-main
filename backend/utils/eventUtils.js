const Events = require('../models/events.model.js');
const Attendee = require('../models/attendee.model.js');
const GroupAttendee = require('../models/groupmember.model.js');

async function countGroupMembers(attendees) {
    let total = 0;
    if (!Array.isArray(attendees)) return total;

    for (const attendee of attendees) {
        if (attendee.group_id) {
            const group = await GroupAttendee.findById(attendee.group_id);
            if (group?.group_member_details && Array.isArray(group.group_member_details)) {
                total += group.group_member_details.length;
            }
        }
    }
    return total;
}

async function getEventCountData() {
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

       
        const totalPreprice = Number(prePriceResult?.[0]?.totalPreprice || 0);
        const totalWalkinPrice = Number(walkinPriceResult?.[0]?.totalWalkinPrice || 0);
        const totalPrice = totalPreprice + totalWalkinPrice;

      
        if (!Array.isArray(walkinAttendees) || !Array.isArray(preAttendees)) {
            throw new Error('Invalid attendee data');
        }

        const [totalGroupmemberwalkinCount, totalGroupmemberpreCount] = await Promise.all([
            countGroupMembers(walkinAttendees),
            countGroupMembers(preAttendees)
        ]);

        const onlineCount = countPreAttendee + totalGroupmemberpreCount;
        const walk_in = countWalkinAttendee + totalGroupmemberwalkinCount;
        const total = onlineCount + walk_in;

        return {
            Total_events: countEvent,
            Online_count: onlineCount,
            Walkin: walk_in,
            TotalRegister: total,
            TotalPrePrice: totalPreprice,
            TotalWalkinPrice: totalWalkinPrice,
            TotalRevenu: totalPrice
        };
    } catch (error) {
        throw new Error('Failed to fetch event count data');
    }
}

module.exports = { getEventCountData };
