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

// const createEventService = async (data) => {
//   try {
//     const {
//       name,
//       status = 'active',
//       draftStatus = false,
//       event_date,
//       event_time,
//       location,
//       max_capacity = 0,
//       walk_in_capacity = 0,
//       pre_registration_capacity = 0,
//       pre_registration_start,
//       pre_registration_end,
//       description = '',
//       allow_group_registration = false,
//       enable_marketing_email = false,
//       pricing_pre_registration = 0,
//       pricing_walk_in = 0,
//       image_url = '',
//       shopify_product_id = '',
//       shopify_product_title = '',
//       created_by
//     } = data;

//     const requiredFields = { name, event_date, event_time, location, created_by };
//     for (const [field, value] of Object.entries(requiredFields)) {
//       if (!value) return { error: `Missing required field: ${field}`, status: 400 };
//     }

//     const isValidDate = (d) => d && !isNaN(new Date(d).getTime());
//     const dateValidations = [
//       { field: 'event_date', value: event_date },
//       { field: 'pre_registration_start', value: pre_registration_start, optional: true },
//       { field: 'pre_registration_end', value: pre_registration_end, optional: true }
//     ];
//     for (const { field, value, optional } of dateValidations) {
//       if ((!optional && !isValidDate(value)) || (optional && value && !isValidDate(value))) {
//         return { error: `Invalid ${field} format`, status: 400 };
//       }
//     }

//     const nonNegativeFields = [
//       { field: 'max_capacity', value: max_capacity },
//       { field: 'walk_in_capacity', value: walk_in_capacity },
//       { field: 'pre_registration_capacity', value: pre_registration_capacity },
//       { field: 'pricing_pre_registration', value: pricing_pre_registration },
//       { field: 'pricing_walk_in', value: pricing_walk_in }
//     ];
//     for (const { field, value } of nonNegativeFields) {
//       if (value < 0) return { error: `${field} must be a non-negative number`, status: 400 };
//     }

//     const event = new Events({
//       name,
//       status,
//       draftStatus,
//       event_date,
//       event_time,
//       location,
//       max_capacity,
//       walk_in_capacity,
//       pre_registration_capacity,
//       pre_registration_start,
//       pre_registration_end,
//       description,
//       allow_group_registration,
//       enable_marketing_email,
//       pricing_pre_registration,
//       pricing_walk_in,
//       image_url,
//       shopify_product_id,
//       shopify_product_title,
//       created_by
//     });

//     event.status = new Date() > new Date(event_date) ? 'past' : 'upcoming';
//     await event.save();
//     const eventId = event._id.toString();

//     const {
//       SHOPIFY_STORE_DOMAIN: store,
//       SHOPIFY_ADMIN_API_TOKEN: accessToken,
//       SHOPIFY_API_VERSION: apiVersion = '2024-04'
//     } = process.env;

//     if (!store || !accessToken) throw new Error('Missing Shopify configuration');
//     const productGid = shopify_product_id.startsWith('gid://') ? shopify_product_id : `gid://shopify/Product/${shopify_product_id}`;

//     // 🟢 Update Product Metafield
//     const updateProductMetafield = async () => {
//       const query = `
//         mutation UpdateProductMetafield($metafields: [MetafieldsSetInput!]!) {
//           metafieldsSet(metafields: $metafields) {
//             metafields { key namespace value type }
//             userErrors { field message }
//           }
//         }
//       `;
//       const variables = {
//         metafields: [{
//           ownerId: productGid,
//           namespace: 'custom',
//           key: 'eventid',
//           type: 'single_line_text_field',
//           value: eventId
//         }]
//       };

//       try {
//         const response = await axios.post(
//           `https://${store}/admin/api/${apiVersion}/graphql.json`,
//           { query, variables },
//           {
//             headers: {
//               'X-Shopify-Access-Token': accessToken,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log('Metafield update response:', JSON.stringify(response.data, null, 2));
//         const { data: { metafieldsSet }, errors } = response.data;
//         if (errors || !metafieldsSet) return { status: false, message: 'Error updating metafield', errors };
//         if (metafieldsSet.userErrors?.length > 0) return { status: false, message: 'Failed to update metafield', errors: metafieldsSet.userErrors };
//         return { status: true, message: 'Metafield updated successfully', data: metafieldsSet.metafields };
//       } catch (error) {
//         return { status: false, message: 'Error updating metafield', error: error.message };
//       }
//     };

//     // 🟢 Get Inventory Details
//     const getInventoryDetails = async (productGid) => {
//       const query = `
//         query GetInventoryInfo($id: ID!) {
//           product(id: $id) {
//             variants(first: 1) {
//               edges {
//                 node {
//                   id
//                   inventoryItem {
//                     id
//                   }
//                 }
//               }
//             }
//           }
//           locations(first: 1) {
//             edges {
//               node {
//                 id
//               }
//             }
//           }
//         }
//       `;
//       try {
//         const response = await axios.post(
//           `https://${store}/admin/api/${apiVersion}/graphql.json`,
//           { query, variables: { id: productGid } },
//           {
//             headers: {
//               'X-Shopify-Access-Token': accessToken,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log('Inventory details response:', JSON.stringify(response.data, null, 2));
//         const productVariant = response.data.data?.product?.variants?.edges?.[0]?.node;
//         const locationId = response.data.data?.locations?.edges?.[0]?.node?.id;
//         if (!productVariant || !locationId) throw new Error('Missing variant or location');
//         return {
//           inventoryItemId: productVariant.inventoryItem.id,
//           locationId
//         };
//       } catch (err) {
//         throw new Error(`Inventory detail fetch failed: ${err.message}`);
//       }
//     };

//     // 🟢 Enable Inventory Tracking
//     const enableInventoryTracking = async (inventoryItemId) => {
//       const mutation = `
//         mutation EnableInventoryTracking($input: InventoryItemUpdateInput!) {
//           inventoryItemUpdate(input: $input) {
//             inventoryItem {
//               id
//               tracked
//             }
//             userErrors {
//               field
//               message
//             }
//           }
//         }
//       `;

//       const variables = {
//         input: {
//           id: inventoryItemId,
//           tracked: true
//         }
//       };

//       try {
//         const response = await axios.post(
//           `https://${store}/admin/api/${apiVersion}/graphql.json`,
//           { query: mutation, variables },
//           {
//             headers: {
//               'X-Shopify-Access-Token': accessToken,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log('Enable tracking response:', JSON.stringify(response.data, null, 2));
//         const data = response.data.data;
//         const errors = response.data.errors || data?.inventoryItemUpdate?.userErrors;
//         if (errors?.length) return { status: false, message: 'Failed to enable inventory tracking', errors };
//         return { status: true, message: 'Inventory tracking enabled' };
//       } catch (err) {
//         return { status: false, message: 'Tracking enablement error', error: err.message };
//       }
//     };

//     // 🟢 Update Shopify Inventory
//     const updateShopifyInventory = async (inventoryItemId, locationId, delta) => {
//       const mutation = `
//         mutation InventorySet($input: InventoryAdjustQuantitiesInput!) {
//           inventoryAdjustQuantities(input: $input) {
//             inventoryAdjustmentGroup {
//               createdAt
//               reason
//             }
//             userErrors {
//               field
//               message
//             }
//           }
//         }
//       `;

//       const variables = {
//         input: {
//           name: "available", // Fixed: Use valid quantity name
//           reason: "correction",
//           changes: [
//             {
//               inventoryItemId,
//               locationId,
//               delta
//             }
//           ]
//         }
//       };

//       try {
//         const response = await axios.post(
//           `https://${store}/admin/api/${apiVersion}/graphql.json`,
//           { query: mutation, variables },
//           {
//             headers: {
//               'X-Shopify-Access-Token': accessToken,
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         console.log('Inventory update response:', JSON.stringify(response.data, null, 2));

//         const data = response.data.data;
//         const errors = data?.inventoryAdjustQuantities?.userErrors;
//         if (errors?.length) {
//           return { status: false, message: 'Inventory update failed', errors };
//         }
//         return {
//           status: true,
//           message: 'Inventory updated successfully',
//           data: data.inventoryAdjustQuantities.inventoryAdjustmentGroup
//         };
//       } catch (err) {
//         return {
//           status: false,
//           message: 'Inventory update error',
//           error: err.message
//         };
//       }
//     };

//     // 🟢 Save Walk-in Event if needed
//     if (walk_in_capacity > 0) {
//       const walkIn = new WalkInEvent({
//         event_id: event._id,
//         event_name: event.name,
//         event_date: event.event_date,
//         walk_in_capacity,
//         remainingWalkInCapacity: walk_in_capacity,
//         pricing_walk_in
//       });
//       await walkIn.save();
//     }

//     // 🟢 Final Calls
//     const shopifyResult = await updateProductMetafield();
//     console.log('Metafield Result:', shopifyResult);

//     let inventoryUpdateResult = {};
//     try {
//       const totalQty = max_capacity - walk_in_capacity;
//       const { inventoryItemId, locationId } = await getInventoryDetails(productGid);
//       console.log('InventoryItemID:', inventoryItemId, 'LocationID:', locationId);

//       const trackingResult = await enableInventoryTracking(inventoryItemId);
//       console.log('Tracking Result:', trackingResult);

//       inventoryUpdateResult = await updateShopifyInventory(inventoryItemId, locationId, totalQty);
//       console.log('Inventory Update Result:', inventoryUpdateResult);
//     } catch (invError) {
//       console.log('Inventory Error:', invError.message);
//       inventoryUpdateResult = { status: false, message: invError.message };
//     }

//     return {
//       status: true,
//       event,
//       shopify: shopifyResult,
//       inventory: inventoryUpdateResult
//     };
//   } catch (error) {
//     console.error('Create Event Error:', error);
//     return {
//       status: false,
//       error: error.message || 'Failed to create event',
//       statusCode: 500
//     };
//   }
// };
const createEventService = async (data) => {
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
      shopify_product_title = '',
      created_by
    } = data;


    const requiredFields = { name, event_date, event_time, location, created_by };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) return { error: `Missing required field: ${field}`, status: 400 };
    }

    const isValidDate = (d) => d && !isNaN(new Date(d).getTime());
    const dateValidations = [
      { field: 'event_date', value: event_date },
      { field: 'pre_registration_start', value: pre_registration_start, optional: true },
      { field: 'pre_registration_end', value: pre_registration_end, optional: true }
    ];
    for (const { field, value, optional } of dateValidations) {
      if ((!optional && !isValidDate(value)) || (optional && value && !isValidDate(value))) {
        return { error: `Invalid ${field} format`, status: 400 };
      }
    }

    const nonNegativeFields = [
      { field: 'max_capacity', value: max_capacity },
      { field: 'walk_in_capacity', value: walk_in_capacity },
      { field: 'pre_registration_capacity', value: pre_registration_capacity },
      { field: 'pricing_pre_registration', value: pricing_pre_registration },
      { field: 'pricing_walk_in', value: pricing_walk_in }
    ];
    for (const { field, value } of nonNegativeFields) {
      if (value < 0) return { error: `${field} must be a non-negative number`, status: 400 };
    }

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

    event.status = new Date() > new Date(event_date) ? 'past' : 'upcoming';
    await event.save();
    const eventId = event._id.toString();

    const {
      SHOPIFY_STORE_DOMAIN: store,
      SHOPIFY_ADMIN_API_TOKEN: accessToken,
      SHOPIFY_API_VERSION: apiVersion = '2024-04'
    } = process.env;

    if (!store || !accessToken) throw new Error('Missing Shopify configuration');
    const productGid = shopify_product_id;

    // Update Product Metafield
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
          ownerId: productGid,
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
        console.log('Metafield update response:', JSON.stringify(response.data, null, 2));
        const { data: { metafieldsSet }, errors } = response.data;
        if (errors || !metafieldsSet) return { status: false, message: 'Error updating metafield', errors };
        if (metafieldsSet.userErrors?.length > 0) return { status: false, message: 'Failed to update metafield', errors: metafieldsSet.userErrors };
        return { status: true, message: 'Metafield updated successfully', data: metafieldsSet.metafields };
      } catch (error) {
        return { status: false, message: 'Error updating metafield', error: error.message };
      }
    };

    // Get Inventory Details
    const getInventoryDetails = async (productGid) => {
      const query = `
        query GetInventoryInfo($id: ID!) {
          product(id: $id) {
            variants(first: 1) {
              edges {
                node {
                  id
                  inventoryItem {
                    id
                  }
                }
              }
            }
          }
          locations(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      `;
      try {
        const response = await axios.post(
          `https://${store}/admin/api/${apiVersion}/graphql.json`,
          { query, variables: { id: productGid } },
          {
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Inventory details response:', JSON.stringify(response.data, null, 2));
        const productVariant = response.data.data?.product?.variants?.edges?.[0]?.node;
        const locationId = response.data.data?.locations?.edges?.[0]?.node?.id;
        if (!productVariant || !locationId) throw new Error('Missing variant or location');
        return {
          inventoryItemId: productVariant.inventoryItem.id,
          locationId
        };
      } catch (err) {
        throw new Error(`Inventory detail fetch failed: ${err.message}`);
      }
    };

    // Enable Inventory Tracking
    const enableInventoryTracking = async (inventoryItemId) => {
      const mutation = `
        mutation EnableInventoryTracking($id: ID!, $tracked: Boolean!) {
          inventoryItemUpdate(id: $id, input: { tracked: $tracked }) {
            inventoryItem {
              id
              tracked
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        id: inventoryItemId,
        tracked: true
      };

      try {
        console.log('EnableInventoryTracking variables:', JSON.stringify(variables, null, 2));
        const response = await axios.post(
          `https://${store}/admin/api/${apiVersion}/graphql.json`,
          { query: mutation, variables },
          {
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Enable tracking response:', JSON.stringify(response.data, null, 2));
        const data = response.data.data;
        const errors = response.data.errors || data?.inventoryItemUpdate?.userErrors;
        if (errors?.length) return { status: false, message: 'Failed to enable inventory tracking', errors };
        if (!data?.inventoryItemUpdate?.inventoryItem) return { status: false, message: 'No inventory item returned' };
        return { status: true, message: 'Inventory tracking enabled', data: data.inventoryItemUpdate.inventoryItem };
      } catch (err) {
        console.error('EnableInventoryTracking error:', err.message);
        return { status: false, message: 'Tracking enablement error', error: err.message };
      }
    };

    // Update Shopify Inventory
    const updateShopifyInventory = async (inventoryItemId, locationId, delta) => {
      const mutation = `
        mutation InventorySet($input: InventoryAdjustQuantitiesInput!) {
          inventoryAdjustQuantities(input: $input) {
            inventoryAdjustmentGroup {
              createdAt
              reason
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        input: {
          name: "available",
          reason: "correction",
          changes: [
            {
              inventoryItemId,
              locationId,
              delta
            }
          ]
        }
      };

      try {
        const response = await axios.post(
          `https://${store}/admin/api/${apiVersion}/graphql.json`,
          { query: mutation, variables },
          {
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Inventory update response:', JSON.stringify(response.data, null, 2));

        const data = response.data.data;
        const errors = data?.inventoryAdjustQuantities?.userErrors;
        if (errors?.length) {
          return { status: false, message: 'Inventory update failed', errors };
        }
        return {
          status: true,
          message: 'Inventory updated successfully',
          data: data.inventoryAdjustQuantities.inventoryAdjustmentGroup
        };
      } catch (err) {
        return {
          status: false,
          message: 'Inventory update error',
          error: err.message
        };
      }
    };
    // Save Walk-in Event if needed
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


    const shopifyResult = await updateProductMetafield();
    console.log('Metafield Result:', shopifyResult);

    let inventoryUpdateResult = {};
    try {
      const totalQty = max_capacity - walk_in_capacity;
      const { inventoryItemId, locationId } = await getInventoryDetails(productGid);
      console.log('InventoryItemID:', inventoryItemId, 'LocationID:', locationId);

      const trackingResult = await enableInventoryTracking(inventoryItemId);
      console.log('Tracking Result:', trackingResult);

      inventoryUpdateResult = await updateShopifyInventory(inventoryItemId, locationId, totalQty);
      console.log('Inventory Update Result:', inventoryUpdateResult);
    } catch (invError) {
      console.log('Inventory Error:', invError.message);
      inventoryUpdateResult = { status: false, message: invError.message };
    }

    return {
      status: true,
      event,
      shopify: shopifyResult,
      inventory: inventoryUpdateResult
    };
  } catch (error) {
    console.error('Create Event Error:', error);
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
  const {
    SHOPIFY_STORE_DOMAIN: store,
    SHOPIFY_ADMIN_API_TOKEN: accessToken,
    SHOPIFY_API_VERSION: apiVersion = '2024-04'
  } = process.env;
  // Get Inventory Details
  const getInventoryDetails = async (productid) => {
    const query = `
      query GetInventoryInfo($id: ID!) {
        product(id: $id) {
          variants(first: 1) {
            edges {
              node {
                id
                inventoryItem {
                  id
                }
              }
            }
          }
        }
        locations(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;
    try {
      const response = await axios.post(
        `https://${store}/admin/api/${apiVersion}/graphql.json`,
        { query, variables: { id: productid } },
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Inventory details response:', JSON.stringify(response.data, null, 2));
      const productVariant = response.data.data?.product?.variants?.edges?.[0]?.node;
      const locationId = response.data.data?.locations?.edges?.[0]?.node?.id;
      if (!productVariant || !locationId) throw new Error('Missing variant or location');
      return {
        inventoryItemId: productVariant.inventoryItem.id,
        locationId,
        variantId: productVariant.id 
      };
    } catch (err) {
      throw new Error(`Inventory detail fetch failed: ${err.message}`);
    }
  };
  function normalizeShopifyProductGID(input) {
    // Extract the numeric ID from the end
    const id = input.match(/\d+$/)?.[0];
    if (!id) return null;
    return `gid://shopify/Product/${id}`;
  }
  // Update Shopify Inventory
  // const updateShopifyInventory = async (inventoryItemId, locationId, delta) => {
  //   const mutation = `
  //     mutation InventorySet($input: InventoryAdjustQuantitiesInput!) {
  //       inventoryAdjustQuantities(input: $input) {
  //         inventoryAdjustmentGroup {
  //           createdAt
  //           reason
  //         }
  //         userErrors {
  //           field
  //           message
  //         }
  //       }
  //     }
  //   `;

  //   const variables = {
  //     input: {
  //       name: "available", // Fixed: Use valid quantity name
  //       reason: "correction",
  //       changes: [
  //         {
  //           inventoryItemId,
  //           locationId,
  //           delta
  //         }
  //       ]
  //     }
  //   };

  //   try {
  //     const response = await axios.post(
  //       `https://${store}/admin/api/${apiVersion}/graphql.json`,
  //       { query: mutation, variables },
  //       {
  //         headers: {
  //           'X-Shopify-Access-Token': accessToken,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );

  //     console.log('Inventory update response:', JSON.stringify(response.data, null, 2));

  //     const data = response.data.data;
  //     const errors = data?.inventoryAdjustQuantities?.userErrors;
  //     if (errors?.length) {
  //       return { status: false, message: 'Inventory update failed', errors };
  //     }
  //     return {
  //       status: true,
  //       message: 'Inventory updated successfully',
  //       data: data.inventoryAdjustQuantities.inventoryAdjustmentGroup
  //     };
  //   } catch (err) {
  //     return {
  //       status: false,
  //       message: 'Inventory update error',
  //       error: err.message
  //     };
  //   }
  // };
  const updateShopifyInventory = async (inventoryItemId, locationId, quantity) => {
    const mutation = `
      mutation InventorySet($input: InventorySetOnHandQuantitiesInput!) {
        inventorySetOnHandQuantities(input: $input) {
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        setQuantities: [
          {
            inventoryItemId,
            locationId,
            quantity,
          }
        ],
        reason: "correction" // Use a valid reason here
      }
    };

    try {
      const response = await axios.post(
        `https://${store}/admin/api/${apiVersion}/graphql.json`,
        { query: mutation, variables },
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Inventory set response:', JSON.stringify(response.data, null, 2));

      const data = response.data.data;
      const errors = data?.inventorySetOnHandQuantities?.userErrors;
      if (errors?.length) {
        return { status: false, message: 'Inventory set failed', errors };
      }

      return {
        status: true,
        message: 'Inventory set successfully'
      };
    } catch (err) {
      return {
        status: false,
        message: 'Inventory set error',
        error: err.message
      };
    }
  };

  const updateVariantPrice = async (variantId, priceAmount) => {
    const mutation = `
      mutation productVariantUpdate($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant {
            id
            price
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
  
    const variables = {
      input: {
        id: variantId,
        price: priceAmount.toString() // Price must be string
      }
    };
  
    try {
      const response = await axios.post(
        `https://${store}/admin/api/${apiVersion}/graphql.json`,
        { query: mutation, variables },
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Price update response:', JSON.stringify(response.data, null, 2));
  
      const errors = response.data.data?.productVariantUpdate?.userErrors;
      if (errors?.length) {
        return { status: false, message: 'Price update failed', errors };
      }
  
      return {
        status: true,
        message: 'Price updated successfully',
        variant: response.data.data.productVariantUpdate.productVariant
      };
    } catch (err) {
      return {
        status: false,
        message: 'Price update error',
        error: err.message
      };
    }
  };
  



  const now = new Date();
  const eventDate = new Date(data.event_date);
  data.status = now > eventDate ? 'past' : 'upcoming';

  console.log(data);
  const rawId = data.shopify_product_id;
  const cleanId = normalizeShopifyProductGID(rawId);

  const totalQty = data.max_capacity - data.walk_in_capacity;
  const { inventoryItemId, locationId, variantId } = await getInventoryDetails(cleanId);
  console.log('InventoryItemID:', inventoryItemId, 'LocationID:', locationId,"variantId",variantId);

  inventoryUpdateResult = await updateShopifyInventory(inventoryItemId, locationId, totalQty);

  console.log('Inventory Update Result:', inventoryUpdateResult);
  if (typeof data.pricing_pre_registration !== 'number') {
    throw new Error('Invalid or missing price in update data');
  }
  const priceUpdateResult = await updateVariantPrice(variantId, data.pricing_pre_registration);
  console.log('Price Update Result:', priceUpdateResult);
  data.shopify_product_id = cleanId;
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