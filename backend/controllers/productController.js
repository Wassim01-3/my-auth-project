const Product = require('../models/Product');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { category, name, price, phoneNumber, address, description } = req.body;
        const images = req.files?.map(file => file.path) || [];
        
        const product = new Product({
            userId: req.userId,
            category,
            name,
            price,
            phoneNumber,
            address,
            description,
            images
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's products
const getUserProducts = async (req, res) => {
    try {
        const products = await Product.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error('Error fetching user products:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, name, price, phoneNumber, address, description } = req.body;
        const images = req.files?.map(file => file.path) || [];

        const product = await Product.findOne({ _id: id, userId: req.userId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.category = category || product.category;
        product.name = name || product.name;
        product.price = price || product.price;
        product.phoneNumber = phoneNumber || product.phoneNumber;
        product.address = address || product.address;
        product.description = description || product.description;
        if (images.length > 0) {
            product.images = images;
        }
        product.updatedAt = Date.now();

        await product.save();
        res.json({ message: 'Product updated successfully', product });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a product
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
