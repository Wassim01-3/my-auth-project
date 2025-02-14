const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session'); // Import express-session
const authRoutes = require('./routes/authRoutes');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Secret key to sign the session ID cookie
    resave: false, // Don't save the session if it hasn't been modified
    saveUninitialized: false, // Don't create a session until something is stored
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        maxAge: 1000 * 60 * 60, // Session expires after 1 hour
    },
}));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Routes
app.use('/api/auth', authRoutes);

// Serve the index.html file as the default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Protect the /home route
app.get('/home', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Access denied. Please log in.');
    }
    res.sendFile(path.join(__dirname, '../frontend/public/home.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
