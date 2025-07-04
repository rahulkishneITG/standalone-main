const Groupmember = require('../models/groupmember.model.js');
const Attendee = require('../models/attendee.model.js');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });

exports.creategroup = async (req, res) => {
  
    let newGroup = null;

    try {
        const {

            event_id,
            group_leader_name,
            group_leader_email,
            group_member_details,
            includeGroupMember,
            registration_type,
            is_paid,
            amount_paid,
            registered_at,
            source,
            shopify_order_id,
            shopify_product_id

        } = req.body;

        if (includeGroupMember === true) {

            if (!event_id || !group_leader_name || !group_leader_email || !Array.isArray(group_member_details)) {
                return res.status(400).json({ message: 'Missing required fields or invalid data format.' });
            }

            // Save group
            newGroup = new Groupmember({
                event_id,
                group_leader_name,
                group_leader_email,
                group_member_details
            });

            await newGroup.save();
            cache.del('event_groups');

            const attendee = new Attendee({

                event_id,
                name: group_leader_name,
                email: group_leader_email,
                group_member_details,
                registration_type: registration_type || "group",
                is_paid: is_paid ?? false,
                amount_paid: amount_paid || 0,
                registered_at: registered_at || new Date(),
                source,
                shopify_order_id,
                shopify_product_id,
                group_id: newGroup._id

            });

            await attendee.save();

        } else {

            const attendee = new Attendee({

                event_id,
                name: group_leader_name,
                email: group_leader_email,
                registration_type: registration_type || "group",
                is_paid: is_paid ?? false,
                amount_paid: amount_paid || 0,
                registered_at: registered_at || new Date(),
                source,
                shopify_order_id,
                shopify_product_id,
                group_id:''

            });

            await attendee.save();
        }

        res.status(201).json({
            message: "Group member details added successfully",
            data: newGroup
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
