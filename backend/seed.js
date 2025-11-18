// seed.js (REVISED for 2-Collection System)
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Counter = require('./models/Counter');
// --- NEW MODELS ---
const MaintenanceDefinition = require('./models/MaintenanceDefinition');
const MaintenanceTask = require('./models/MaintenanceTask');

dotenv.config();

// --- PASTE YOUR HASH HERE ---
const YOUR_HASH = "$2b$10$iUWT8.j.uVw4wxex1AAy8uVa5gvs0NJO5SWvi1Kl2H.94HPIWADaK"; 

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // 1. --- Clear ALL Old Data ---
        console.log('Clearing old data...');
        await User.deleteMany({});
        await Counter.deleteMany({});
        await MaintenanceDefinition.deleteMany({});
        await MaintenanceTask.deleteMany({});
        
        // Reset counters
        await Counter.create({ _id: 'userId', seq: 0 });
        await Counter.create({ _id: 'definitionId', seq: 0 });
        await Counter.create({ _id: 'taskId', seq: 0 });

        // 2. --- Create Users ---
        console.log('Creating users...');
        await User.create({
            email: "student-kc@hostel.com", password_hash: YOUR_HASH, role: "student",
            hostel_id: "kalpana-chawla", hostel_name: "Kalpana Chawla",
            floor_number: 5, room_number: "501"
        });
        await User.create({
            email: "warden-kc@hostel.com", password_hash: YOUR_HASH, role: "warden",
            hostel_id: "kalpana-chawla", hostel_name: "Kalpana Chawla"
        });

        // 3. --- Create Maintenance DEFINITIONS (The Master List) ---
        console.log('Creating maintenance definitions...');
        
        const def1 = await MaintenanceDefinition.create({
            title: "Daily Corridor Cleaning", category: "Cleaning",
            recurrence_interval_days: 1, default_location: "All Floors"
        });

        const def2 = await MaintenanceDefinition.create({
            title: "Water Filter Maintenance", category: "Plumbing",
            recurrence_interval_days: 21, default_location: "Mess"
        });

        const def3 = await MaintenanceDefinition.create({
            title: "Washing Machine Service", category: "Electrical",
            recurrence_interval_days: 21, default_location: "Laundry Room"
        });
        
        const def4 = await MaintenanceDefinition.create({
            title: "LAN Port Repair", category: "IT",
            recurrence_interval_days: 0, default_location: "Varies"
        });

        // 4. --- Create Initial TASKS (The First Jobs) ---
        console.log('Creating initial tasks...');
        const today = new Date();

        await MaintenanceTask.create({
            definition: def1._id, // Links to "Daily Corridor Cleaning"
            hostel_id: "kalpana-chawla",
            status: "Pending",
            scheduledFor: today // Due today
        });

        await MaintenanceTask.create({
            definition: def2._id, // Links to "Water Filter"
            hostel_id: "kalpana-chawla",
            status: "Pending",
            scheduledFor: today // Due today
        });
        
        await MaintenanceTask.create({
            definition: def3._id, // Links to "Washing Machine"
            hostel_id: "kalpana-chawla",
            status: "Pending",
            scheduledFor: today // Due today
        });
        
        // We DON'T create a task for LAN repair (def4) because it's reactive (recurrence: 0).
        // It will be created by other logic (e.g., when a complaint is filed).

        console.log('------------------------------------');
        console.log('✅ Database Seeding Successful!');
        console.log('------------------------------------');

    } catch (err) {
        console.error('Seeding failed:', err.message);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB Disconnected.');
    }
};

seedDB();