const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const Product = require('../models/Product');

// Configure multer for memory storage (no disk storage needed)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 3 * 1024 * 1024, // 3MB
        files: 5 // Max 5 files
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Error handling middleware for file uploads
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
            message: err.code === 'LIMIT_FILE_SIZE' ? 
                   'File too large (max 3MB)' : 
                   'File upload error' 
        });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

// Protected routes
router.post('/', 
    authMiddleware, 
    upload.array('images', 5), 
    handleUploadErrors,
    productController.createProduct
);

router.get('/my-products', 
    authMiddleware, 
    productController.getUserProducts
);

router.put('/:id', 
    authMiddleware, 
    upload.array('images', 5), 
    handleUploadErrors,
    productController.updateProduct
);

router.delete('/:id', 
    authMiddleware, 
    productController.deleteProduct
);
// Get all products (public route)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        
        // Add full backend URL to image paths if needed
        const productsWithFullUrls = products.map(product => ({
            ...product.toObject(),
            images: product.images // Cloudinary URLs are already complete
        }));
        
        res.json(productsWithFullUrls);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Add this route if it doesn't exist
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
