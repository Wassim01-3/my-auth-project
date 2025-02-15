const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import the controller

// Define routes
router.post('/register', authController.register); // Use the register function
router.post('/login', authController.login); // Use the login function

module.exports = router;
