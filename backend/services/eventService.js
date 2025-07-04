const Events = require('../models/events.model.js');
const Attendee = require('../models/attendee.model.js');
const GroupAttendee = require('../models/groupmember.model.js');
const WalkInEvent = require('../models/walk_in.model.js');
const axios = require('axios');

const getPaginatedEvents = async ({ page, limit, search, sortBy, order }) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === 'asc' ? 1 : -1;

  const query = search
    ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
      ],
    }
    : {};

  const [events, total] = await Promise.all([
    Events.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Events.countDocuments(query),
  ]);



  return { events, total };
};

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
      Attendee.countDocuments({ registration_as: "walkin" }),
      Attendee.countDocuments({ registration_as: "pre" }),
      Events.aggregate([
        { $group: { _id: null, totalPreprice: { $sum: "$pricing_pre_registration" } } }
      ]),
      Events.aggregate([
        { $group: { _id: null, totalWalkinPrice: { $sum: "$pricing_walk_in" } } }
      ]),
      Attendee.find({ registration_as: "walkin" }),
      Attendee.find({ registration_as: "pre" })
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

const createEventService = async (data) => {
  try {
    // Destructure with defaults
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
      shopify_product_title = '',
      created_by
    } = data;

    // Validate required fields
    const requiredFields = { name, event_date, event_time, location, created_by };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return { error: `Missing required field: ${field}`, status: 400 };
      }
    }

    // Validate dates
    const isValidDate = (d) => d && !isNaN(new Date(d).getTime());
    const dateValidations = [
      { field: 'event_date', value: event_date },
      { field: 'pre_registration_start', value: pre_registration_start, optional: true },
      { field: 'pre_registration_end', value: pre_registration_end, optional: true }
    ];

    for (const { field, value, optional } of dateValidations) {
      if (!optional && !isValidDate(value) || (optional && value && !isValidDate(value))) {
        return { error: `Invalid ${field} format`, status: 400 };
      }
    }

    // Validate non-negative numbers
    const nonNegativeFields = [
      { field: 'max_capacity', value: max_capacity },
      { field: 'walk_in_capacity', value: walk_in_capacity },
      { field: 'pre_registration_capacity', value: pre_registration_capacity },
      { field: 'pricing_pre_registration', value: pricing_pre_registration },
      { field: 'pricing_walk_in', value: pricing_walk_in }
    ];

    for (const { field, value } of nonNegativeFields) {
      if (value < 0) {
        return { error: `${field} must be a non-negative number`, status: 400 };
      }
    }

    // Create event
    const event = new Events({
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
      shopify_product_title,
      created_by
    });

    // Set event status based on date
    event.status = new Date() > new Date(event_date) ? 'past' : 'upcoming';

    // Save event (single save operation)
    await event.save();
    const eventId = event._id.toString();

    // Shopify configuration
    const { SHOPIFY_STORE_DOMAIN: store, SHOPIFY_ADMIN_API_TOKEN: accessToken, SHOPIFY_API_VERSION: apiVersion = '2025-04' } = process.env;

    if (!store || !accessToken) {
      throw new Error('Missing Shopify configuration');
    }

    // Shopify GraphQL mutation
    const updateProductMetafield = async () => {
      const query = `
        mutation UpdateProductMetafield($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields { key namespace value type }
            userErrors { field message }
          }
        }
      `;

      const variables = {
        metafields: [{
          ownerId: 'gid://shopify/Product/9966670774589',
          namespace: 'custom',
          key: 'eventid',
          type: 'single_line_text_field',
          value: eventId
        }]
      };

      try {
        const response = await axios.post(
          `https://${store}/admin/api/${apiVersion}/graphql.json`,
          { query, variables },
          {
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json'
            }
          }
        );

        const { data: { metafieldsSet }, errors } = response.data;

        if (errors || !metafieldsSet) {
          return {
            status: false,
            message: 'Error updating metafield',
            errors: errors || [{ message: 'Invalid response structure' }]
          };
        }

        if (metafieldsSet.userErrors?.length > 0) {
          return {
            status: false,
            message: 'Failed to update metafield',
            errors: metafieldsSet.userErrors
          };
        }

        return {
          status: true,
          message: 'Metafield updated successfully',
          data: metafieldsSet.metafields
        };
      } catch (error) {
        return {
          status: false,
          message: 'Error updating metafield',
          error: error.message
        };
      }
    };

    // Create walk-in event if applicable
    if (walk_in_capacity > 0) {
      const walkIn = new WalkInEvent({
        event_id: event._id,
        event_name: event.name,
        event_date: event.event_date,
        walk_in_capacity,
        remainingWalkInCapacity: walk_in_capacity,
        pricing_walk_in
      });
      await walkIn.save();
    }

    // Execute Shopify update and return result
    const shopifyResult = await updateProductMetafield();

    return {
      status: true,
      event,
      shopify: shopifyResult
    };
  } catch (error) {
    return {
      status: false,
      error: error.message || 'Failed to create event',
      statusCode: 500
    };
  }
};

const getEventByIdService = async (eventId) => {
  return await Events.findById(eventId);
};

const updateEvent = async (updateId, data) => {
  if (!updateId) {
    throw new Error('Update ID is required');
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error('Update data is required');
  }

  const now = new Date();
  const eventDate = new Date(data.event_date);
  data.status = now > eventDate ? 'past' : 'upcoming';

  const updatedEvent = await Events.findByIdAndUpdate(
    updateId,
    { $set: data },
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedEvent) {
    throw new Error('Event not found');
  }

  return updatedEvent;
};




module.exports = { getEventCountData, getPaginatedEvents, createEventService, getEventByIdService, updateEvent };