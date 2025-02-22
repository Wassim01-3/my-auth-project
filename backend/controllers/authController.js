const User = require('../models/User');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login request received:', { email, password });

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (user.password !== password) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Store the user ID in the session
    req.session.userId = user._id;
    console.log('Session created for user:', user._id);
    console.log('Session ID:', req.sessionID);
    console.log('Session data after login:', req.session);

    // Return a success message
    const responseData = { message: 'Login successful', redirectUrl: 'https://my-auth-project.onrender.com/home' };
    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log('Registration request received:', { username, email, password });

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ username, email, password });
    await user.save();

    // Return a success message
    const responseData = { message: 'Registration successful', redirectUrl: 'https://my-auth-project.onrender.com/login' };
    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.json({ message: 'Logout successful' });
  });
};

module.exports = { login, register, logout };
