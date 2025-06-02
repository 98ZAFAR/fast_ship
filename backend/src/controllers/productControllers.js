const Product = require("../models/productModel");

const handleAddProduct = async(req, res) => {
    try {
        const {name, description, price, stock, category, imageURL} = req.body;
        const sellerId = req.user.id;

        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }
        const newProduct = {
            name,
            description,
            price,
            stock,
            sellerId,
            category,
            imageURL: imageURL || ""
        };
        const product = await Product.create(newProduct);
        return res.status(201).json({
            success: true,
            message: "Product added successfully!",
            data: {product}
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
        console.error(error);
    }
};

const handleGetProducts = async(req, res) => {
    try {
        const products = await Product.findAll();

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully!",
            data: {products}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
        console.error(error);
    }
};

const handleGetProductById = async(req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully!",
            data: {product}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
        console.error(error);
    }
};

const handleUpdateProduct = async(req, res) => {
    try {
        const productId = req.params.id;
        const {name, description, price, stock, category, imageURL} = req.body;

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.category = category || product.category;
        product.imageURL = imageURL || product.imageURL;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            data: {product}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
        console.error(error);
    }
};

const handleDeleteProduct = async(req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            });
        }

        await product.destroy();

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        });
        console.error(error);
    }
};

module.exports = {
    handleAddProduct,
    handleGetProducts,
    handleGetProductById,
    handleUpdateProduct,
    handleDeleteProduct
};