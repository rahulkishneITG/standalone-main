const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  registrationType: {
    type: String,
    enum: ["Pre-registration", "Walk-in"],
    required: true,
  },
  isPaid: { type: Boolean, default: false },
  amountPaid: { type: Number, default: 0, min: 0 },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    default: null,
  },
  source: {
    type: String,
    enum: ["Shopify", "Manual"],
    default: "Shopify",
  },
  shopifyOrderId: {
    type: String,
    default: null,
  },
  shopifyProductId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

attendeeSchema.index({ email: 1, eventId: 1 }, { unique: true });
module.exports = mongoose.model("Attendee", attendeeSchema);
