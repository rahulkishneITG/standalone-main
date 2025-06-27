const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Groupmember = require('../models/groupmember.model.js');
const Attendee = require('../models/attendee.model.js');
const { getAttendeeList, createAttendeeService }  = require('../services/attendeeService.js');

dotenv.config();

const eventData = async () => {
    try {
        // Check if the Attendee collection already has data
        const attendeeCount = await Attendee.countDocuments();
        if (attendeeCount > 0) {
            console.log('Data already exists in the Attendee collection. Seeder will not run.');
            process.exit(0);
        }

        const event_id = '65abcde123456789abcdef12';

        const payloads = [
            {
                main_guest: {
                    first_name: 'Amit',
                    last_name: 'Sharma',
                    email: 'amit.sharma@example.com'
                },
                event_id,
                registration_type: 'individual',
                registration_as: 'pre',
                is_paid: 'yes',
                amount_paid: 150,
                source: 'website',
                shopify_order_id: 'SO10001',
                shopify_product_id: 'SP10001'
            },
            {
                main_guest: {
                    first_name: 'Sneha',
                    last_name: 'Kumar',
                    email: 'sneha.kumar@example.com'
                },
                event_id,
                registration_type: 'individual',
                registration_as: 'pre',
                is_paid: 'no',
                amount_paid: 0,
                source: 'app',
                shopify_order_id: '',
                shopify_product_id: ''
            },
            {
                main_guest: {
                    first_name: 'Neha',
                    last_name: 'Verma',
                    email: 'neha.verma@example.com'
                },
                event_id,
                registration_type: 'group',
                registration_as: 'walk-in',
                is_paid: 'yes',
                amount_paid: 500,
                source: 'referral',
                shopify_order_id: 'SO20001',
                shopify_product_id: 'SP20001',
                additional_guests: [
                    {
                        first_name: 'Ravi',
                        last_name: 'Patel',
                        email: 'ravi.patel@example.com',
                        permission: true
                    },
                    {
                        first_name: 'Kiran',
                        last_name: 'Mehta',
                        email: 'kiran.mehta@example.com',
                        permission: false
                    }
                ]
            },
            {
                main_guest: {
                    first_name: 'Manish',
                    last_name: 'Jain',
                    email: 'manish.jain@example.com'
                },
                event_id,
                registration_type: 'individual',
                registration_as: 'pre',
                is_paid: 'yes',
                amount_paid: 600,
                source: 'instagram',
                shopify_order_id: 'SO20002',
                shopify_product_id: 'SP20002',
                additional_guests: [
                    {
                        first_name: 'Preeti',
                        last_name: 'Sinha',
                        email: 'preeti.sinha@example.com',
                        permission: true
                    },
                    {
                        first_name: 'Tarun',
                        last_name: 'Kapoor',
                        email: 'tarun.kapoor@example.com',
                        permission: true
                    }
                ]
            },
            {
                main_guest: {
                    first_name: 'Ritika',
                    last_name: 'Desai',
                    email: 'ritika.desai@example.com'
                },
                event_id,
                registration_type: 'group',
                registration_as: 'walk-in',
                is_paid: 'no',
                amount_paid: 0,
                source: 'linkedin',
                shopify_order_id: '',
                shopify_product_id: '',
                additional_guests: [
                    {
                        first_name: 'Gaurav',
                        last_name: 'Yadav',
                        email: 'gaurav.yadav@example.com',
                        permission: false
                    },
                    {
                        first_name: 'Anjali',
                        last_name: 'Singh',
                        email: 'anjali.singh@example.com',
                        permission: true
                    }
                ]
            }
        ];

        for (const payload of payloads) {
            const result = await createAttendeeService(payload);
            console.log('Seeded:', result.message);
        }

        console.log('\n🎉 All 5 attendees inserted successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeder error:', err.message);
        process.exit(1);
    }
};

module.exports = eventData;