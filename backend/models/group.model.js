const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  groupLeaderName: { type: String, required: true },
  groupLeaderEmail: {
    type: String,
    required: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendee",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);
