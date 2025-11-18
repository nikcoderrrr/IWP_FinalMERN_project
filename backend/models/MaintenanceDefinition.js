// backend/models/MaintenanceDefinition.js
const mongoose = require('mongoose');
const Counter = require('./Counter');

const MaintenanceDefinitionSchema = new mongoose.Schema({
    definitionId: { 
        type: Number, 
        unique: true 
    },
    title: { 
        type: String, 
        required: true // e.g., "Water Filter Cleaning"
    },
    description: {
        type: String 
    },
    category: {
        type: String, // e.g., "Cleaning", "Electrical", "Plumbing"
        required: true
    },
    recurrence_interval_days: {
        type: Number,
        required: true,
        default: 0 // 0 = Does not repeat automatically (like LAN repair)
    },
    default_location: {
        type: String, // e.g., "All Floors", "Mess", "Gym"
        required: true
    }
});

// Auto-incrementing definitionId
MaintenanceDefinitionSchema.pre('save', async function(next) {
    if (!this.isNew) return next();
    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'definitionId' }, 
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.definitionId = counter.seq;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('MaintenanceDefinition', MaintenanceDefinitionSchema);