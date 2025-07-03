const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String },
  draftStatus: {type: Boolean},
  event_date: { type: Date },
  event_time: { type: String }, 
  location: { type: String },
  max_capacity: { type: Number },
  walk_in_capacity: { type: Number },
  pre_registration_capacity: { type: Number },
  pre_registration_start: { type: Date },
  pre_registration_end: { type: Date },
  description: { type: String },
  allow_group_registration: { type: Boolean, default: false },
  enable_marketing_email: { type: Boolean, default: false },
  pricing_pre_registration: { type: mongoose.Types.Decimal128 },
  pricing_walk_in: { type: mongoose.Types.Decimal128 },
  image_url: { type: String },
  shopify_product_id: { type: String },
  shopify_product_title: { type: String},
  created_by: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

EventSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const Event = mongoose.model('Events', EventSchema);

module.exports = Event;
