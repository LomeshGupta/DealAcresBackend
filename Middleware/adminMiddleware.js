// adminMiddleware.js
const dotenv = require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

async function adminMiddleware(req, res, next) {
    // Get the token from the request header
    const token = req.header('Authorization');

    // Check if token is present
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        
        // Add user information to request object for further use in routes
        req.user = decoded.user;

        // Check if user is admin
        const user = await User.findById(decoded.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Not an admin' });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

module.exports = adminMiddleware;
