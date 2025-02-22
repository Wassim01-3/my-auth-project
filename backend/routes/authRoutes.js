const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Fetch logged-in user data
router.get('/user', (req, res) => {
  console.log('Session ID:', req.sessionID); // Log the session ID
  console.log('User ID from session:', req.session.userId); // Log the user ID from session

  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Fetch user data from the database
  User.findById(req.session.userId)
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
