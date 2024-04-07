// authMiddleware.js
const dotenv = require("dotenv").config();
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
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
        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

module.exports = authMiddleware;
