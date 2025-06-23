
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Groupmember = require('../models/groupmember.model.js');
const Attendee = require('../models/attendee.model.js');

dotenv.config();

const eventData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        const Groupmembercheck = await Groupmember.find({});
        const AttendeeCheck = await Attendee.find({});

        if (Groupmembercheck.length === 0) {
            for (let i = 1; i <= 5; i++) {

                const event_id = new mongoose.Types.ObjectId();

                const group_member_details = [
                    { name: `MemberA-${i}`, email: `membera${i}@example.com` },
                    { name: `MemberB-${i}`, email: `memberb${i}@example.com` },
                ];

                const group = new Groupmember({
                    event_id,
                    group_leader_name: `Leader-${i}`,
                    group_leader_email: `leader${i}@example.com`,
                    group_member_details
                });

                await group.save();

                const attendee = new Attendee({
                    event_id,
                    name: `Leader-${i}`,
                    email: `leader${i}@example.com`,
                    group_member_details,
                    registration_type: 'Group',
                    is_paid: true ? "Yes" : "No",
                    amount_paid: 100 + i * 10,
                    registered_at: new Date(),
                    source: 'seeder-script',
                    shopify_order_id: `orderG-${i}`,
                    shopify_product_id: `productG-${i}`,
                    group_id: group._id
                });

                await attendee.save();
            }     

            console.log('GroupMember Details seeded!');
        } else {
            console.log('Group Memeber Details already exist.');
        }


        if (AttendeeCheck.length === 0) {
            for (let i = 1; i <= 5; i++) {
                const event_id = new mongoose.Types.ObjectId();

                const soloAttendee = new Attendee({
                    event_id,
                    name: `SoloUser-${i}`,
                    email: `solo${i}@example.com`,
                    registration_type: 'Individual',
                    is_paid: false ? "No" : "Yes",
                    amount_paid: 0,
                    registered_at: new Date(),
                    source: 'seeder-script',
                    shopify_order_id: `orderS-${i}`,
                    shopify_product_id: `productS-${i}`,
                    group_id: '' // no group
                });

                await soloAttendee.save();
            }
        } else {
            console.log('registeris not empty');
        }
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

module.exports = eventData;