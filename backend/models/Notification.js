const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    senderName: {
        type: String,
        required: false,
    },
    senderProfileImage: {
        type: String,
        default: false, 
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['friend-request', 'comment', 'like'],
        required: false,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
    },
    friendRequestId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FriendRequest', 
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;