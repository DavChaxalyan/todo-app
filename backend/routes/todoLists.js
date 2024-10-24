const express = require('express');
const TodoList = require('../models/TodoList');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
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

// Create a new ToDo list
router.post('/todo', authMiddleware, async (req, res) => {
  const { title } = req.body;
  const newList = new TodoList({ title, user: req.user.id, items: [] });
  try {
    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to an existing ToDo list
router.post('/todo/:id/items', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  
  try {
    const list = await TodoList.findOne({ _id: id, user: req.user.id });
    if (!list) return res.status(404).json({ message: 'ToDo list not found' });

    const newItem = { text, completed: false, createdAt: new Date() };
    list.items.push(newItem);
    await list.save();
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all ToDo lists for the user
router.get('/todo', authMiddleware, async (req, res) => {
  try {
    const lists = await TodoList.find({ user: req.user.id });
    res.json(lists);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a ToDo list
router.put('/todo/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const list = await TodoList.findOneAndUpdate({ _id: id, user: req.user.id }, { title, completed }, { new: true });
    if (!list) return res.status(404).json({ message: 'ToDo list not found' });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a ToDo list
router.delete('/todo/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const list = await TodoList.findOneAndDelete({ _id: id, user: req.user.id });
    if (!list) return res.status(404).json({ message: 'ToDo list not found' });
    res.json({ message: 'ToDo list deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific item in a ToDo list
router.put('/todo/:listId/items/:itemId', authMiddleware, async (req, res) => {
  const { listId, itemId } = req.params;
  const { text, completed } = req.body;

  try {
    const list = await TodoList.findOne({ _id: listId, user: req.user.id });
    if (!list) return res.status(404).json({ message: 'ToDo list not found' });

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.text = text;
    item.completed = completed;
    await list.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/friend/todos/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  try {
    const lists = await TodoList.find({ user: id });
    
    if (lists.length === 0) {
      return res.status(404).json({ message: 'No ToDo lists found for this user.' });
    }
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like or unlike a ToDo list
router.post('/todo/:id/like', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const sender = await User.findById(req.body.senderId); 
  
  if (!sender) {
    return res.status(404).json({ message: 'User not found' });
  }
  try {
    const list = await TodoList.findById(id);
    if (!list) return res.status(404).json({ message: 'ToDo list not found' });
    
    if (list.likes.includes(req.body.senderId)) {
      list.likes = list.likes.filter(like => like.toString() !== req.body.senderId);
    } else {
      list.likes.push(req.body.senderId);

      const newNotification = new Notification({
        userId: req.body.userId, 
        senderId: req.body.senderId,
        senderName: sender.name || null,
        senderProfileImage: sender.profileImage || null,
        message: `liked your ToDo list.`,
        type: "like",
        status: "pending"
      });
      
      await newNotification.save(); 
    }

    await list.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/todo/:id/likes', authMiddleware, async (req, res) => {
  try {
    const todo = await TodoList.findById(req.params.id).populate('likes');
    
    res.json(todo.likes); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching likes' });
  }
});

router.delete('/todo/:id/unlike', authMiddleware, async (req, res) => {
  const { id } = req.params; 
  const { senderId } = req.body; 

  try {
    const list = await TodoList.findById(id);
    if (!list) return res.status(404).json({ message: 'ToDo list not found' });

    if (!list.likes.includes(senderId)) {
      return res.status(400).json({ message: 'User has not liked this ToDo list' });
    }

    list.likes = list.likes.filter(like => like.toString() !== senderId);

    await Notification.findOneAndDelete({
      userId: list.user,
      senderId: senderId,
      type: 'like'
    });

    await list.save();

    res.json({ message: 'Like and associated notification removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/todo/:id/comment', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.body.userId;
  const sender = await User.findById(req.body.senderId);

  try {
    const list = await TodoList.findById(id);
    if (!list) return res.status(404).json({ message: 'ToDo list not found' });
    if (!text) return res.status(404).json({ message: 'Text not a valid'})
    const comment = {
      user: req.user.id,
      text: text,
      createdAt: new Date()
    };

    list.comments.push(comment);
    const newNotification = new Notification({
      userId: req.body.userId,
      senderId: req.body.senderId,
      senderName: sender.name || null,
      senderProfileImage: sender.profileImage || null,
      message: ` commented on your ToDo list.`,
      type: "comment",
      status: "pending"
    });
    
    await newNotification.save(); 
    await list.save();
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/todo/:id/comments', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const list = await TodoList.findById(id).populate('comments.user', 'name'); 
    if (!list) return res.status(404).json({ message: 'ToDo list not found' });
    
    res.json(list.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/todo/:todoId/comments/:commentId', authMiddleware, async (req, res) => {
  const { todoId, commentId } = req.params;
  try {
    const list = await TodoList.findById(todoId);
    if (!list) return res.status(404).json({ message: 'ToDo list not found' });

    const commentIndex = list.comments.findIndex(comment => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const comment = list.comments[commentIndex];
    
    list.comments.splice(commentIndex, 1);

    await list.save();
    
    await Notification.findOneAndDelete({
      type: 'comment',
      senderId: comment.user,
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
