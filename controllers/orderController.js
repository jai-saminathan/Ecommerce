const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

exports.createOrder = async (req, res, next) => {
  try {
    const cartItems = req.body;
    const amount = Number(cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0).toFixed(2));
    const status = 'pending';
    const order = await orderModel.create({ cartItems, amount, status });

    for (const item of cartItems) {
      const product = await productModel.findById(item.product._id);
      if (product) {
        product.stock -= item.qty;  
        await product.save();
      } else {
        console.error(`Product with ID ${item.product._id} not found`);
      }
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "There was an error creating the order."
    });
  }
};
