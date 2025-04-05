const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const createProduct = async (req, res) => {
    try {
        const { category, name, price, phoneNumber, address, description } = req.body;
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        // Upload all images to Cloudinary
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: `green-tunisia/products/user-${req.userId}`,
                        resource_type: 'auto',
                        quality: 'auto',
                        fetch_format: 'auto'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
        });

        const uploadResults = await Promise.all(uploadPromises);
        const images = uploadResults.map(result => result.secure_url);
        
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
        
        res.status(201).json({ 
            message: 'Product created successfully', 
            product
        });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserProducts = async (req, res) => {
    try {
        const products = await Product.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error('Error fetching user products:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, name, price, phoneNumber, address, description } = req.body;

        const product = await Product.findOne({ _id: id, userId: req.userId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let images = product.images;
        
        // If new images were uploaded
        if (req.files && req.files.length > 0) {
            // Upload new images to Cloudinary
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: `green-tunisia/products/user-${req.userId}`,
                            resource_type: 'auto'
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    
                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                });
            });

            const uploadResults = await Promise.all(uploadPromises);
            images = uploadResults.map(result => result.secure_url);
        }

        // Update product fields
        product.category = category || product.category;
        product.name = name || product.name;
        product.price = price || product.price;
        product.phoneNumber = phoneNumber || product.phoneNumber;
        product.address = address || product.address;
        product.description = description || product.description;
        product.images = images;
        product.updatedAt = Date.now();
        
        await product.save();
        
        res.json({ 
            message: 'Product updated successfully', 
            product
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
        
        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            const deletePromises = product.images.map(imageUrl => {
                const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
                return cloudinary.uploader.destroy(publicId);
            });
            
            await Promise.all(deletePromises);
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createProduct, getUserProducts, updateProduct, deleteProduct };
