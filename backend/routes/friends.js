// routes/friends.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");
const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const Friends = require("../models/Friends");
const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

router.get("/notifications", authMiddleware, async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id });
  res.json(notifications);
});

router.get('/notifications/all', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find()
            .populate('senderId', "_id") 
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error retrieving all notifications:", error);
        res.status(500).json({ message: "Server error." });
    }
});

router.post("/friend-requests/respond", authMiddleware, async (req, res) => {
    const { notificationId } = req.body;
    
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
  
    const { senderId, userId } = notification; 

    await Friends.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { friends: senderId } }, 
        { new: true, upsert: true } 
    );
    
    await Friends.findOneAndUpdate(
        { userId: senderId },
        { $addToSet: { friends: userId } },
        { new: true, upsert: true }
    );
  
    await Notification.deleteOne({ _id: notificationId });
    await FriendRequest.deleteOne({ _id: notification.friendRequestId});
    
    return res.json({
      message: "Friend request accepted.",
    });
  });

  router.get("/friends", authMiddleware, async (req, res) => {
    try {
      const userFriends = await Friends.findOne({ userId: req.user.id }).populate("friends"); 
      
      if (!userFriends) {
        return res.json([]); 
      }
  
      return res.json(userFriends.friends); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  });

  router.get("/friends/viewProfile/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    
    try {
      const friend = await User.findById(id);
      const friends = await Friends.findOne({ userId: friend._id }).populate("friends");
      
      if (!friend) {
        return res.status(404).json({ message: "Friend not found." });
      }
  
      const friendData = {
        id: friend._id,
        name: friend.name,
        email: friend.email,
        profileImage: friend.profileImage,
        city: friend.city,
        age: friend.age,
        interests: friend.interests,
        status: friend.status,
        friends: friends, 
      };
  
      res.json(friendData);
    } catch (error) {
      console.error("Error retrieving friend:", error);
      res.status(500).json({ message: "Server error." });
    }
  });

  router.post("/friends/remove", authMiddleware, async (req, res) => {
    const { friendId } = req.body; 
  
    try {
      await Friends.findOneAndUpdate(
        { userId: req.user.id },
        { $pull: { friends: friendId } },
        { new: true } 
      );
  
      await Friends.findOneAndUpdate(
        { userId: friendId },
        { $pull: { friends: req.user.id } }, 
        { new: true }
      );
  
      return res.json({
        message: "Friend removed successfully.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  });

module.exports = router;
