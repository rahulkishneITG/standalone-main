
const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
  name: String,
  email: String
});

const attendeeSchema = new mongoose.Schema({
  id: { type: Number }, // Usually not needed in MongoDB, but kept if explicitly required
  event_id: { type: String, },
  name: { type: String, },
  email: { type: String, },
  group_member_details: [groupMemberSchema],
  registration_type: { type: String },
  is_paid: { type: String, },
  amount_paid: { type: mongoose.Decimal128, default: 0.00 },
  registered_at: { type: Date, default: Date.now },
  group_id: { type: String },
  source: { type: String },
  shopify_order_id: { type: String },
  shopify_product_id: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Attendee = mongoose.model('attendee', attendeeSchema);

module.exports = Attendee;

