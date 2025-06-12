const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
    default: "Upcoming",
  },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  location: { type: String, required: true },
  maxCapacity: { type: Number, required: true, min: 1 },
  walkInCapacity: { type: Number, required: true, min: 0 },
  preRegistrationCapacity: { type: Number, required: true, min: 0 },
  preRegistrationStart: { type: Date, required: true },
  preRegistrationEnd: { type: Date, required: true },
  description: { type: String },
  allowGroupRegistration: { type: Boolean, default: false },
  enableMarketingEmail: { type: Boolean, default: false },
  pricing: {
    preRegistration: { type: Number, required: true, min: 0 },
    walkIn: { type: Number, required: true, min: 0 },
  },
  imageUrl: { type: String },
  shopifyProductId: {
    type: String,
    required: true,
    unique: true, // ensure one product = one event
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
