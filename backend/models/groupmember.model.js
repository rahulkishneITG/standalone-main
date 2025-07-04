const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
  name: String,
  email: String,
  preferences_chm: String,
  preferences_dr_brownstein: String,
  preferences_opt_in: String
});

const eventGroupSchema = new mongoose.Schema({
  event_id: { type: String},
  group_leader_name: { type: String },
  group_leader_email: { type: String},
  group_member_details: [groupMemberSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const EventGroup = mongoose.model('groupMember', eventGroupSchema);

module.exports = EventGroup;