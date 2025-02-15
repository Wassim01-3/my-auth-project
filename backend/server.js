const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import authRoutes
const path = require('path');
require('dotenv').config();

const app = express();

// Log environment variables
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Configure CORS to allow requests from the static site
app.use(cors({
    origin: 'https://my-auth-project.onrender.com', // Allow requests from your static site
    credentials: true, // Allow cookies to be sent
}));

// Configure session middleware with connect-mongo
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 60 * 60, // 1 hour
    }),
    cookie: {
        secure: true, // Use HTTPS
        httpOnly: true, // Prevent client-side JS from accessing the cookie
        maxAge: 1000 * 60 * 60, // 1 hour
        sameSite: 'none', // Allow cross-origin cookies
    },
}));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Routes
app.use('/api/auth', authRoutes); // Use authRoutes

// Serve the index.html file as the default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Protect the /home route
app.get('/home', (req, res) => {
    console.log('Session data:', req.session); // Log the session
    if (!req.session.userId) {
        return res.status(401).send('Access denied. Please log in.');
    }
    res.sendFile(path.join(__dirname, '../frontend/public/home.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
