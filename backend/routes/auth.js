// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Updated User Model

// @route   POST /api/auth/login
// @desc    Authenticate User (Student/Warden) & Get Token
// @access  Public
router.post('/login', async (req, res) => {
    // Expecting 'email' and 'password' to match frontend AuthService mock
    const { email, password } = req.body; 

    try {
        // 1. Find the user by email (User data must be pre-loaded/seeded)
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        // 2. Compare Passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        // 3. Create JWT Payload (The identity card for the user)
        const payload = {
            user: {
                // Use the sequential userId
                userId: user.userId, 
                mongoId: user.id,
                role: user.role,
                hostelId: user.hostel_id
            }
        };

        // 4. Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                
                // Construct the full 'user' object expected by the frontend mock
                const displayName = user.role === 'warden' 
                    ? `Warden (${user.hostel_name})` 
                    : `Student (${user.hostel_name})`;

                // Success: Return the token and the 'user' object
                res.json({ 
                    success: true, 
                    token, 
                    user: {
                        id: user.userId, // Sequential ID
                        name: displayName, 
                        role: user.role,
                        hostelName: user.hostel_name,
                        hostelId: user.hostel_id
                    }
                }); 
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during login');
    }
});

module.exports = router;