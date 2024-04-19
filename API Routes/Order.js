const express = require('express');
const Order = require('../Models/Order');
const Product = require('../Models/Product');
const User = require('../Models/User');
const Cart = require('../Models/Cart');
const requireAuth = require('../authToken');

const router = express.Router();

// POST create a new order
router.post('/orders', async (req, res) => {
  const { userId, products, quantities } = req.body;

  try {
    if (!Array.isArray(products) || !Array.isArray(quantities) || products.length !== quantities.length) {
      return res.status(400).json({ message: 'Invalid products or quantities' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let total = 0;
    const productsExist = await Promise.all(products.map(async (productId, index) => {
      const product = await Product.findById(productId);
      if (!product) {
        return false;
      }
      total += product.pricing * quantities[index];
      return true;
    }));

    if (productsExist.includes(false)) {
      return res.status(404).json({ message: 'Some products not found' });
    }

    const order = new Order({
      user: userId,
      products,
      quantities,
      totalPrice: total,
    });

    const newOrder = await order.save();

    // Delete the cart after placing the order
    await Cart.deleteOne({ user: userId });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
