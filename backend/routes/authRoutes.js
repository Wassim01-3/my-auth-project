const express = require('express');
const { login, register } = require('../controllers/authController'); // Import the functions

const router = express.Router();

// Define the routes
router.post('/register', register); // Use the register function
router.post('/login', login); // Use the login function

module.exports = router;
