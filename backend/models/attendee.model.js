const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  id: { type: Number },
  event_id: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  group_first_name: { type: String },
  group_last_name: { type: String },
  group_email: { type: String },
  permission: { type: Boolean, default: false },
  current_chm: { type: Boolean, default: false },
  registration_type: { type: String },
  registration_as: { type: String },
  is_paid: { type: String },
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
