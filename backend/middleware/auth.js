// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' }); // Adjust path to .env file

const verifyToken = (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Remove 'Bearer ' prefix if present
    token = token.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user payload (userId, role, hostelId) to the request
        req.user = decoded.user; 

        next();

    } catch (e) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const isWarden = (req, res, next) => {
    if (req.user && req.user.role === 'warden') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied: Warden privilege required' });
    }
};

module.exports = { verifyToken, isWarden };