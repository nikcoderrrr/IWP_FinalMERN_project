// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { // Student Enrollment No. or Warden Employee ID
    type: String,
    required: true,
    unique: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Student', 'Warden'],
    required: true
  },
  hostel_id: {
    type: String,
    required: true
  },
  floor_number: { // Required only if role is 'Student'
    type: Number,
    required: function() { return this.role === 'Student'; }
  },
  room_number: { // Required only if role is 'Student'
    type: String,
    required: function() { return this.role === 'Student'; }
  }
});

module.exports = mongoose.model('User', UserSchema);