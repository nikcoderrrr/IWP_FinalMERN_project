<<<<<<< HEAD
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { // <-- CHANGED from 'username'
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6, // Added for security
    select: false // Don't send password back on find()
  },
  role: {
    type: String,
    enum: ['Student', 'Warden'],
    required: true
  },
  hostel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  // We'll keep 'username' as a display name, not for login
  username: {
    type: String,
    required: true
  },
  floor_number: {
    type: Number,
    required: function() { return this.role === 'Student'; }
  },
  room_number: {
    type: String,
    required: function() { return this.role === 'Student'; }
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
=======
// backend/models/User.js (REVISED for Frontend Mock Alignment)
const mongoose = require('mongoose');
const Counter = require('./Counter');
const UserSchema = new mongoose.Schema({
    userId: { // <-- NEW FIELD FOR SEQUENTIAL ID
        type: Number, 
        unique: true 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required.'], 
        unique: true, 
        trim: true 
    },
    password_hash: { 
        type: String, 
        required: [true, 'Password is required.'] 
    },
    role: { 
        type: String, 
        enum: ['student', 'warden'], // Changed to lowercase to match mock
        required: [true, 'Role is required.'] 
    },
    hostel_id: { 
        type: String, 
        required: [true, 'Hostel ID is required.'] 
    },
    hostel_name: { // ADDED for frontend display consistency
        type: String, 
        required: [true, 'Hostel Name is required.'] 
    },
    // These fields are only required if the role is 'student'
    floor_number: { 
        type: Number, 
        required: function() { return this.role === 'student'; } 
    },
    room_number: { 
        type: String, 
        required: function() { return this.role === 'student'; } 
    }
}, { timestamps: true });


// --- Pre-Save Hook for Auto-Increment ---
UserSchema.pre('save', async function(next) {
    if (!this.isNew) { // Only run for new documents
        return next();
    }

    try {
        // Find and atomically increment the 'userId' counter sequence
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Assign the new sequential number to userId
        this.userId = counter.seq;
        next();
    } catch (error) {
        console.error('Error auto-incrementing userId:', error);
        next(error);
    }
>>>>>>> 177ba14a20807d0795b7902aac701412051314d0
});

// Method to compare entered password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);