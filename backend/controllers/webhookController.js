const Attendee = require("../models/attendee.model");


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
