const User = require('../models/User');

const login = async (req, res) => {
  console.log('Login request body:', req.body); // Log the request body
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); // Log if the user is not found
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (user.password !== password) {
      console.log('Invalid password'); // Log if the password is invalid
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Store the user ID in the session
    req.session.userId = user._id;
    console.log('Session created for user:', user._id); // Log the session
    console.log('Session ID:', req.sessionID); // Log the session ID

    // Return a success message
    res.json({ message: 'Login successful', redirectUrl: 'https://my-auth-project.onrender.com/home' });
  } catch (err) {
    console.error('Login error:', err); // Log any errors
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };
