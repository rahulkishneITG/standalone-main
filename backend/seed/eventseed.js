// seed/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/events.model.js');

dotenv.config();

const eventData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        const existingEvent = await Event.find({});
        if (existingEvent.length === 0) {
            const event = [
                {
                    name: "AI Summit 2025",
                    status: "Past",
                    draftStatus:false,
                    event_date: "2025-08-10",
                    event_time: "10:00",
                    location: "Mumbai Convention Center",
                    max_capacity: 300,
                    walk_in_capacity: 0,
                    pre_registration_capacity: 300,
                    pre_registration_start: "2025-07-01T09:00:00",
                    pre_registration_end: "2025-08-05T18:00:00",
                    description: "Explore the future of Artificial Intelligence and Machine Learning.",
                    allow_group_registration: true,
                    enable_marketing_email: true,
                    pricing_pre_registration: 149.99,
                    pricing_walk_in: 199.99,
                    image_url: "https://example.com/events/ai-summit.jpg",
                    shopify_product_id: "gid://shopify/Product/100001",
                    created_by: 1,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    name: "Green Tech Expo",
                    status: "Upcoming",   
                    draftStatus:true,
                    event_date: "2025-09-05",
                    event_time: "11:00",
                    location: "Bangalore Eco Hub",
                    max_capacity: 400,
                    walk_in_capacity: 80,
                    pre_registration_capacity: 320,
                    pre_registration_start: "2025-08-01T08:00:00",
                    pre_registration_end: "2025-09-01T18:00:00",
                    description: "Showcasing sustainable technologies and environmental innovation.",
                    allow_group_registration: false,
                    enable_marketing_email: true,
                    pricing_pre_registration: 99.00,
                    pricing_walk_in: 149.00,
                    image_url: "https://example.com/events/green-tech.jpg",
                    shopify_product_id: "gid://shopify/Product/100002",
                    created_by: 2,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    name: "Startup Pitch Fest",
                    status: "Completed",
                    draftStatus:true,
                    event_date: "2025-05-15",
                    event_time: "14:00", 
                    location: "Delhi Startup Incubator",
                    max_capacity: 200,
                    walk_in_capacity: 40,
                    pre_registration_capacity: 160,
                    pre_registration_start: "2025-04-01T09:00:00",
                    pre_registration_end: "2025-05-10T20:00:00",
                    description: "Pitch your startup idea to top investors and VCs.",
                    allow_group_registration: false,
                    enable_marketing_email: true,
                    pricing_pre_registration: 0.00,
                    pricing_walk_in: 49.99,
                    image_url: "https://example.com/events/startup-pitch.jpg",
                    shopify_product_id: "gid://shopify/Product/100003",
                    created_by: 3,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    name: "Digital Art Fair",
                    status: "Upcoming",
                    draftStatus:true,
                    event_date: "2025-10-21",
                    event_time: "09:30",
                    location: "Hyderabad Creative Arena",
                    max_capacity: 350,
                    walk_in_capacity: 75,
                    pre_registration_capacity: 275,
                    pre_registration_start: "2025-09-10T09:00:00",
                    pre_registration_end: "2025-10-18T23:59:59",
                    description: "Experience the best of NFT and digital artwork exhibits.",
                    allow_group_registration: true,
                    enable_marketing_email: false,
                    pricing_pre_registration: 120.00,
                    pricing_walk_in: 180.00,
                    image_url: "https://example.com/events/digital-art.jpg",
                    shopify_product_id: "gid://shopify/Product/100004",
                    created_by: 1,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                { 
                    name: "Women in Tech Meetup",
                    status: "Upcoming",
                    draftStatus:true,
                    event_date: "2025-11-18",
                    event_time: "13:00",
                    location: "Chennai Tech Hub",
                    max_capacity: 250,
                    walk_in_capacity: 30,
                    pre_registration_capacity: 220,
                    pre_registration_start: "2025-10-10T08:00:00",
                    pre_registration_end: "2025-11-15T18:00:00",
                    description: "Empowering women in tech through talks, panels, and networking.",
                    allow_group_registration: true,
                    enable_marketing_email: true,
                    pricing_pre_registration: 59.99,
                    pricing_walk_in: 89.99,
                    image_url: "https://example.com/events/women-tech.jpg",
                    shopify_product_id: "gid://shopify/Product/100005",
                    created_by: 2,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ];

            for (const eventData of event) {
                const event = new Event(eventData);
                await event.save();
            }
            console.log('Event Details seeded!');
        } else {
            console.log('Event Details already exist.');
        }
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

module.exports = eventData;