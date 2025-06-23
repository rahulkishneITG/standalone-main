const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
  name: String,
  email: String,
  permission:Boolean
});

const eventGroupSchema = new mongoose.Schema({
  event_id: { type: String, required: true },
  group_leader_name: { type: String, required: true },
  group_leader_email: { type: String, required: true },
  group_member_details: [groupMemberSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const EventGroup = mongoose.model('groupMember', eventGroupSchema);

module.exports = EventGroup;