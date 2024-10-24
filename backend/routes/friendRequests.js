const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const FriendRequest = require('../models/FriendRequest');
const Notification = require('../models/Notification');
const User = require("../models/User");

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

router.post('/send-friend-request', authMiddleware, async (req, res) => {
    
    const senderId = req.user._id; 
    const userId = req.body.user._id; 
    const sender = await User.findById(req.user.id);
    try {
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: userId, status: 'pending' },
                { sender: userId, receiver: senderId, status: 'pending' }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "You have already sent a request to this user." });
        }
        
        const friendRequest = new FriendRequest({ sender: senderId, receiver: userId, status: 'pending' });
        await friendRequest.save();

        const newNotification = new Notification({
            userId,
            senderId: req.user.id,
            senderName: sender.name || null,
            senderProfileImage: sender.profileImage || null, 
            message: `wants to add you as a friend.`,
            type: "friend-request",
            status: "pending",
            friendRequestId: friendRequest._id
        });
      
        await newNotification.save();

        
        res.status(201).json(friendRequest);
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

router.get('/check-request', authMiddleware, async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: req.user.id, receiver: userId },
                { sender: userId, receiver: req.user.id }
            ]
        });

        return res.status(200).json({ exists: !!existingRequest });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});

router.delete('/delete-notification/:notificationId', authMiddleware, async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findById(notificationId);
        if (notification.type === 'friend-request') {
            const requestFriend = await FriendRequest.findById(notification.friendRequestId)
            if (!requestFriend) {
                return res.status(404).json({ message: "Notification not found." });
            }
            await Notification.deleteOne({ _id: notificationId });
            await FriendRequest.deleteOne({ _id: requestFriend._id });
        } else if(notification.type === 'like' || notification.type === 'comment'){
            if (!notification) {
                return res.status(404).json({ message: "Notification not found." });
            }
            await Notification.deleteOne({ _id: notificationId });
        }
        res.status(200).json({ message: "Notification deleted." });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
