// backend/models/MaintenanceTask.js (REVISED)
const mongoose = require('mongoose');
const Counter = require('./Counter'); 

const MaintenanceTaskSchema = new mongoose.Schema({
    taskId: { 
        type: Number, 
        unique: true 
    },
    // This is the "link" to the definition
    definition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceDefinition',
        required: true
    },
    hostel_id: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Overdue'], 
        default: 'Pending'
    },
    scheduledFor: { 
        type: Date, 
        required: true 
    },
    completedOn: { 
        type: Date 
    },
    completedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

// Auto-incrementing taskId
MaintenanceTaskSchema.pre('save', async function(next) {
    if (!this.isNew) return next();
    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'taskId' }, 
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.taskId = counter.seq;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('MaintenanceTask', MaintenanceTaskSchema);