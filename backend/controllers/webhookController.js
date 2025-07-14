const { default: mongoose } = require("mongoose");
const Attendee = require("../models/attendee.model.js");
const Events = require("../models/events.model.js");
const crypto = require("crypto");

exports.OrderWebhook = async (req, res) => {
  console.log('OrderWebhook called');
  const body = req.body;
  console.log(body);
  try {
    const attendeesToUpdate = [];

    for (const item of body.line_items || []) {
      const props = item.properties || [];

      const eventId = props.find(p => p.name === 'event_id')?.value;
      if (!eventId) continue;

      // Collect all emails
      const emails = [];

      const mainEmail = props.find(p => p.name === 'attendee_email')?.value;
      if (mainEmail) emails.push(mainEmail);

      // Collect guest emails
      for (let i = 1; i <= 4; i++) {
        const guestEmail = props.find(p => p.name === `guest_${i}_email`)?.value;
        if (guestEmail) emails.push(guestEmail);
      }

      // Prepare attendees list
      for (const email of emails) {
        attendeesToUpdate.push({ event_id: eventId, email });
      }
    }

    if (attendeesToUpdate.length === 0) {
      console.warn('No valid attendees found in order');
      return res.status(400).send('No attendees to update');
    }

    console.log('Attendees to mark paid:', attendeesToUpdate);

    // Update attendees in DB
    for (const { event_id, email } of attendeesToUpdate) {
      const result = await Attendee.findOneAndUpdate(
        { event_id, email },
        { $set: { is_paid: true } },
        { new: true }
      );

      if (result) {
        console.log(`Paid: ${email} for event ${event_id}`);
      } else {
        console.warn(`Not found: ${email} for event ${event_id}`);
      }
    }

    res.status(200).send('Webhook processed');
  } catch (err) {
    console.error('Error processing webhook:', err.message);
    res.status(500).send('Internal Server Error');
  }
};
exports.updateInventory = async (req, res) => {
  const productData = req.body;
  console.log(productData);
  const productId = productData?.id;
  if (!productId) {
    console.error('productData.id not found');
    return res.status(400).send('Invalid product payload');
  }
  const formattedShopifyProductId = `gid://shopify/Product/${productId}`;

  const inventoryItemExistsInDatabase = async (formattedId) => {
    try {
      const event = await Events.findOne({ shopify_product_id: formattedId }).exec();
      return !!event;
    } catch (error) {
      console.error('Error checking event in database:', error);
      return false;
    }
  };
  // const updateInventoryInDatabase = async (productData) => {

  //   const mainEvent = await Events.findOne({ shopify_product_id: formattedShopifyProductId }).lean();

  //   const inventoryQuantity = productData.variants?.[0]?.inventory_quantity;

  //   const maxCapacity = mainEvent?.max_capacity ?? 0;
  //   const walkInCapacity = mainEvent?.walk_in_capacity ?? 0;

  //   if (!mainEvent) {
  //     console.log("No matching event found");
  //     return res.status(404).send('Event not found');
  //   }

  //   let updatedWalkInCapacity = 0;
  //   let updatedMaxCapacity = maxCapacity;

  //   if (inventoryQuantity <= maxCapacity) {
  //     updatedWalkInCapacity = maxCapacity - inventoryQuantity;
  //   } else {
  //     const overflow = inventoryQuantity - maxCapacity;
  //     updatedMaxCapacity = maxCapacity + overflow;
  //     updatedWalkInCapacity = 0;
  //   }

  //   mainEvent.walk_in_capacity = updatedWalkInCapacity;
  //   mainEvent.max_capacity = updatedMaxCapacity;

  //   await Events.updateOne(
  //     { shopify_product_id: formattedShopifyProductId },
  //     {
  //       $set: {
  //         max_capacity: updatedMaxCapacity,
  //         walk_in_capacity: updatedWalkInCapacity,
  //       }
  //     }
  //   );

  //   console.log('Inventory updated:', {
  //     productId,
  //     inventoryQuantity,
  //     updatedWalkInCapacity,
  //     updatedMaxCapacity,
  //   });

  // };
  const updateInventoryInDatabase = async (productData) => {
    const mainEvent = await Events.findOne({ shopify_product_id: formattedShopifyProductId });
    console.log(mainEvent);
    if (!mainEvent) {
      console.log("No matching event found");
      return;
    }
  
    const variant = productData.variants?.[0];
    const inventoryQuantity = parseInt(variant?.inventory_quantity ?? 0);
    const price = parseFloat(variant?.price ?? 0);
    const maxCapacity = mainEvent.max_capacity ?? 0;
  
    let updatedWalkInCapacity = 0;
    let updatedMaxCapacity = maxCapacity;
  
    if (inventoryQuantity <= maxCapacity) {
      updatedWalkInCapacity = maxCapacity - inventoryQuantity;
    } else {
      const overflow = inventoryQuantity - maxCapacity;
      updatedMaxCapacity += overflow;
      updatedWalkInCapacity = 0;
    }
  
    // Update only the needed fields
    const updateResult = await Events.updateOne(
      { shopify_product_id: formattedShopifyProductId },
      {
        $set: {
          max_capacity: updatedMaxCapacity,
          walk_in_capacity: updatedWalkInCapacity,
          pricing_pre_registration: mongoose.Types.Decimal128.fromString(price.toString())
        }
      }
    );
  
    console.log('Inventory updated:', {
      productId: productData.id,
      inventoryQuantity,
      updatedWalkInCapacity,
      updatedMaxCapacity,
      pricing_pre_registration: price,
      modified: updateResult.modifiedCount,
      matched: updateResult.matchedCount,
    });
  
    if (updateResult.modifiedCount === 0) {
      console.warn('Document found but not modified. Check if values are already the same.');
    }
  };
  
  
  if (await inventoryItemExistsInDatabase(formattedShopifyProductId)) {
    console.log("got it")
    await updateInventoryInDatabase(productData);
  }

  res.status(200).send('Product Update Handled');
};
