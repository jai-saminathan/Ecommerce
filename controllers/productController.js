const ProductModel = require('../models/productModel');

exports.getProducts = async (req, res, next) => {
    const query = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};

    try {
        const products = await ProductModel.find(query);
        res.json({
            success: true,
            products
        });
    } catch (error) {
        next(error); 
    }
};

exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};
