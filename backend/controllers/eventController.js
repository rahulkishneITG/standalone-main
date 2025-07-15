const Events = require('../models/events.model.js');
const Walkin = require("../models/walk_in.model.js");
const { getPaginatedEvents, getEventCountData, createEventService, updateEvent } = require('../services/eventService.js');


exports.createEvent = async (req, res) => {
    try {
        const result = await createEventService(req.body);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        return res.status(201).json({
            message: 'Event created successfully',
            event: result.event
        });

    } catch (err) {

        res.status(500).json({ message: 'Internal server error111' });
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
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getEventCount = async (req, res) => {
    try {
        const data = await getEventCountData();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to count events' });
    }
};

exports.deletedEvent = async (req, res) => {
    const { delId } = req.params;

    if (!delId || typeof delId !== 'string') {
        return res.status(400).json({ error: "Invalid or missing delId." });
    }

    try {
        const result = await Events.findByIdAndDelete(delId);
        if (!result) {
            return res.status(404).json({ message: "Event not found" });
        }
        await Walkin.deleteMany({ event_id: delId });
        
        return res.status(200).json({ message: "Deleted successfully", deleted: result });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.editEvent = async (req, res) => {
    try {
        const { editId } = req.params;

        if (!editId || typeof editId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing editId.' });
        }

        const event = await Events.findById(editId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        return res.status(200).json({
            message: 'Event fetched successfully.',
            data: event
        });

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.updateEventData = async (req, res) => {
    try {
        const { updateId } = req.params;
        const data = req.body;

        const updatedEvent = await updateEvent(updateId, data);

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: updatedEvent
        });
    } catch (error) {
        const statusCode = error.message === 'Event not found' ? 404 :
            error.message.includes('is required') ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

exports.eventDetails = async (req, res) => {
    try {
        eventId = req.body.id;
        if (eventId) {
            const event = await Events.findById(eventId);

            if (!event) {
                return res.status(404).json({ error: 'Event not found.' });
            }
           
            return res.status(200).json({
                status: true,
                message: 'Event details fetched successfully',
                data: event
            });
        }
    } catch (error) {
        
        return res.status(500).json({
            status: false,
            message: 'Failed to fetch event details',
            error: error.message
        });
    }
};



