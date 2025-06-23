const mongoose = require('mongoose');

const walkInEventSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Events',
    required: true
  },
  event_name: {
    type: String,
    required: true
  },
  event_date: {
    type: Date,
    required: true
  },
  walk_in_capacity: {
    type: Number,
    default: 0
  },
  pricing_walk_in: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('WalkInEvent', walkInEventSchema);
