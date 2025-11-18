// backend/routes/maintenance.js
const express = require('express');
const router = express.Router();
const MaintenanceTask = require('../models/MaintenanceTask');
const MaintenanceDefinition = require('../models/MaintenanceDefinition'); // Required for population
const { verifyToken, isWarden } = require('../middleware/auth'); // Security middleware

// @route   GET /api/maintenance
// @desc    Get all maintenance tasks for the logged-in warden's hostel
// @access  Private (Warden Only)
router.get('/', [verifyToken, isWarden], async (req, res) => {
    try {
        // Find tasks just for this warden's hostel
        const tasks = await MaintenanceTask.find({ 
            hostel_id: req.user.hostelId 
        })
        // Use .populate() to join the data from the 'MaintenanceDefinition' collection.
        // This pulls in the 'title', 'category', etc., for each task.
        .populate('definition', 'title category recurrence_interval_days default_location') 
        .sort({ scheduledFor: 1 }); // Sort by the nearest due date first

        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/maintenance/:taskId
// @desc    Update a task (mark as 'Completed') AND auto-create the next task
// @access  Private (Warden Only)
router.put('/:taskId', [verifyToken, isWarden], async (req, res) => {
    
    try {
        // 1. Find the task to be completed.
        // We MUST populate the definition to read its recurrence rules.
        let task = await MaintenanceTask.findOne({ taskId: req.params.taskId })
            .populate('definition');

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        
        // 2. Authorization check: Is this warden allowed to modify this task?
        if (task.hostel_id !== req.user.hostelId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // 3. Update the current task's status
        task.status = 'Completed';
        task.completedOn = new Date();
        task.completedBy = req.user.mongoId; // Log which warden did it (from token)
        await task.save();

        // 4. --- AUTOMATION LOGIC ---
        // Get the recurrence interval from the populated definition
        const interval = task.definition.recurrence_interval_days;
        
        // If interval > 0, it's a repeating task.
        if (interval > 0) {
            
            // Calculate the next due date
            let nextDueDate = new Date();
            nextDueDate.setDate(nextDueDate.getDate() + interval);

            // Create the next task in the series
            const nextTask = new MaintenanceTask({
                definition: task.definition._id, // Link to the SAME definition
                hostel_id: task.hostel_id,
                status: 'Pending', // Reset status to Pending
                scheduledFor: nextDueDate // Set the new future due date
            });
            await nextTask.save();
        }

        // 5. Return the task that was just completed
        res.json(task); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;