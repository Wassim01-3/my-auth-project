const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware'); // Import the middleware
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
app.use(cookieParser()); // Use cookie-parser middleware

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Routes
app.use('/api/auth', authRoutes);

// Serve the index.html file as the default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Protect the /home route
app.get('/home', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/home.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
