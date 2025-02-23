const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Fetch logged-in user data (protected route)
router.get('/user', authMiddleware, (req, res) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ username: user.username, email: user.email });
    })
    .catch(err => {
      console.error('Error fetching user data:', err);
      res.status(500).json({ message: 'Server error' });
    });
});

// User logout
router.post('/logout', authController.logout);

module.exports = router;
