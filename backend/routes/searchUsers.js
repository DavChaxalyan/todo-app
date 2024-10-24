const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

router.get('/users/search', authMiddleware, async (req, res) => {
    const { name } = req.query; 
    try {
        const users = await User.find({ name: new RegExp(name, 'i') });
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;