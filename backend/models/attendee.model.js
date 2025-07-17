const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  id: { type: Number },
  event_id: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  name: { type: String},
  email: { type: String },
  group_first_name: { type: String },
  group_last_name: { type: String },
  group_email: { type: String },
  permission: { type: Boolean, default: false },
  is_chm_patient: { type: String},
  registration_type: { type: String },
  registration_as: { type: String },
  is_paid: { type: Boolean, default: false },
  amount_paid: { type: mongoose.Decimal128, default: 0.00 },
  registered_at: { type: Date, default: Date.now },
  group_id: { type: String },
  attendee_main_id: { type: String },
  source: { type: String },
  shopify_order_id: { type: String },
  shopify_product_id: { type: String },
  email_preferences_chm: { type: Boolean },
  email_preferences_dr_brownstein: { type: Boolean },
  email_preferences_opt_in: { type: Boolean },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Attendee = mongoose.model('attendee', attendeeSchema);
module.exports = Attendee;
