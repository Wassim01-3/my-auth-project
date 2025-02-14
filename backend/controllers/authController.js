const User = require('../models/User');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct (you should use bcrypt for hashing)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Store the user ID in the session
        req.session.userId = user._id;
        console.log('Session created for user:', user._id); // Log the session for debugging

        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { login };
