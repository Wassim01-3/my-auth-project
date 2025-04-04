const Product = require('../models/Product');

const createProduct = async (req, res) => {
    try {
        const { category, name, price, phoneNumber, address, description } = req.body;
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        // Store all images in one product
        const images = req.files.map(file => `/uploads/${file.filename}`);
        
        const product = new Product({
            userId: req.userId,
            category,
            name,
            price,
            phoneNumber,
            address,
            description,
            images  // This now contains all uploaded images
        });

        await product.save();
        
        res.status(201).json({ 
            message: 'Product created successfully', 
            product: {
                ...product.toObject(),
                images: product.images.map(img => `${req.protocol}://${req.get('host')}${img}`)
            }
        });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// [Keep all other existing controller functions exactly as they were]
const getUserProducts = async (req, res) => {
    try {
        const products = await Product.find({ userId: req.userId }).sort({ createdAt: -1 });
        
        // Add full backend URL to image paths
        const productsWithFullUrls = products.map(product => ({
            ...product.toObject(),
            images: product.images.map(img => `https://green-tunisia-h3ji.onrender.com${img}`)
        }));
        
        res.json(productsWithFullUrls);
    } catch (err) {
        console.error('Error fetching user products:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, name, price, phoneNumber, address, description } = req.body;
        const newImages = req.files?.map(file => `/uploads/${file.filename}`) || [];

        const product = await Product.findOne({ _id: id, userId: req.userId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields
        product.category = category || product.category;
        product.name = name || product.name;
        product.price = price || product.price;
        product.phoneNumber = phoneNumber || product.phoneNumber;
        product.address = address || product.address;
        product.description = description || product.description;
        
        // Only update images if new ones were uploaded
        if (newImages.length > 0) {
            product.images = newImages;
        }

        product.updatedAt = Date.now();
        await product.save();
        
        // Return product with full image URLs
        const productWithFullUrls = {
            ...product.toObject(),
            images: product.images.map(img => `https://green-tunisia-h3ji.onrender.com${img}`)
        };
        
        res.json({ 
            message: 'Product updated successfully', 
            product: productWithFullUrls 
        });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndDelete({ _id: id, userId: req.userId });
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createProduct, getUserProducts, updateProduct, deleteProduct };
