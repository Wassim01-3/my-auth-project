const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');

// User login
router.post('/login', (req, res) => {
  console.log('Login request received:', req.body); // Log the request body
  authController.login(req, res);
});

// Fetch logged-in user data
router.get('/user', (req, res) => {
  console.log('Session data:', req.session); // Log the session
  console.log('Session userId:', req.session.userId); // Log the userId from the session

  if (!req.session.userId) {
    console.log('User not authenticated'); // Log if the user is not authenticated
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Fetch user data from the database
  User.findById(req.session.userId)
    .then(user => {
      if (!user) {
        console.log('User not found in database'); // Log if the user is not found
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('User data fetched:', user); // Log the fetched user data
      res.json({ username: user.username, email: user.email });
    })
    .catch(err => {
      console.error('Error fetching user data:', err); // Log any errors
      res.status(500).json({ message: 'Server error' });
    });
});

module.exports = router;
