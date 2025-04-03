const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }
});

router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { category, name, price, phoneNumber, address, description } = req.body;
    const images = req.files.map(file => '/uploads/' + file.filename);

    const product = new Product({
      userId: req.user.userId,
      category,
      name,
      price,
      phoneNumber,
      address,
      description,
      images
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-products', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.userId });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
