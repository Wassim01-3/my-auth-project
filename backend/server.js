const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware'); // Import the middleware
const path = require('path');
require('dotenv').config();

const app = express();

// Log environment variables
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'https://my-auth-project.onrender.com', // Replace with your frontend URL
  credentials: true, // Allow credentials (cookies)
}));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);

// Serve the index.html file as the default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Protect the /home route
app.get('/home', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

// Start the server
const PORT = process.env.PORT || 10000; // Use the correct port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
