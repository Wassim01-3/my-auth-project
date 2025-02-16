const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Store the user ID in the session
        req.session.userId = user._id;
        console.log('Session created for user:', user._id); // Log the session
        console.log('Session ID:', req.sessionID); // Log the session ID

        // Redirect to the frontend's /home page
        res.redirect('https://my-auth-project.onrender.com/home');
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const user = new User({ username, email, password });
        await user.save();

        // Redirect to the frontend's /login page
        res.redirect('https://my-auth-project.onrender.com/login');
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { login, register };
