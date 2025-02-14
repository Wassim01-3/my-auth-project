const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Configure session middleware with connect-mongo
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // MongoDB connection string
        ttl: 60 * 60, // Session TTL (1 hour)
    }),
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
