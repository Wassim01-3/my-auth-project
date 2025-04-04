const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const app = express();

// Log environment variables (keep existing logging)
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Connect to MongoDB (keep existing connection)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Middleware (keep existing middleware)
app.use(express.json());
app.use(cors({
  origin: [
    'https://my-auth-project.onrender.com',
    'https://green-tunisia-h3ji.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// Serve static files (keep existing static files config)
app.use(express.static(path.join(__dirname, '../public')));

// NEW: Ensure uploads directory exists on startup
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory:', uploadDir);
}

// NEW: Explicitly serve uploads with cache headers
app.use('/uploads', express.static(uploadDir, {
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  }
}));

// Routes (keep existing routes)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Keep all existing route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/home', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

// Keep existing health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uploadsDir: uploadDir });
});

// Start server (keep existing server start)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadDir}`);
  console.log(`Static files served from: ${path.join(__dirname, '../public')}`);
});
