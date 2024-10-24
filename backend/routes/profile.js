const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/profile', authMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    const { name, username, email, age, city, interests } = req.body;
    
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = name;
      user.username = username;
      user.email = email;
      user.age = age;
      user.city = city;
      user.interests = interests;

      if (req.file) {
        user.profileImage = req.file.path; 
      }

      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password successfully changed' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;
