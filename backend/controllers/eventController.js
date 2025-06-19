const Events = require('../models/events.model.js');
const Attendee = require('../models/attendee.model.js');
const GroupAttendee = require('../models/groupmember.model.js');
const jwt = require('jsonwebtoken');
const Services = require('../services/auth.services.js');
const NodeCache = require('node-cache');
const { getPaginatedEvents ,getEventCountData} = require('../services/eventService.js');

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

       
        if (!name || !event_date || !event_time || !location || !created_by) {
            return res.status(400).json({
                message: 'Required fields: name, event_date, event_time, location, created_by'
            });
        }

        
        const eventDate = new Date(event_date);
        const currentDate = new Date();
        if (isNaN(eventDate.getTime())) {
            return res.status(400).json({ message: 'Invalid event_date format' });
        }
        if (pre_registration_start && isNaN(new Date(pre_registration_start).getTime())) {
            return res.status(400).json({ message: 'Invalid pre_registration_start date' });
        }
        if (pre_registration_end && isNaN(new Date(pre_registration_end).getTime())) {
            return res.status(400).json({ message: 'Invalid pre_registration_end date' });
        }

       
        if (
            max_capacity < 0 ||
            walk_in_capacity < 0 ||
            pre_registration_capacity < 0
        ) {
            return res.status(400).json({
                message: 'Capacities must be non-negative numbers'
            });
        }

        
        if (pricing_pre_registration < 0 || pricing_walk_in < 0) {
            return res.status(400).json({
                message: 'Pricing values must be non-negative numbers'
            });
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

       
        const createdDate = new Date(result.created_at);
        let updatedStatus = result.status;

        if (createdDate > eventDate) {
            updatedStatus = 'past';
        } else {
            updatedStatus = 'upcoming';
        }

        result.status = updatedStatus;
        await result.save();

        res.status(200).send("Event Details added and status updated");

    } catch (err) {
        console.error('Error saving event:', err);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.getEventList = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'name',
    order = 'asc',
  } = req.query;

  try {
    const { events, total } = await getPaginatedEvents({
      page,
      limit,
      search,
      sortBy,
      order,
    });
    
    res.status(200).json({ data: events, total });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getEventCount = async (req, res) => {
    try {
        const data = await getEventCountData();
        res.status(200).json(data);
    } catch (err) {
        console.error('Error counting events:', err);
        res.status(500).json({ error: 'Failed to count events' });
    }
};


