const express = require('express');
const Order = require('../Models/Order');
const Product = require('../Models/Product');
const User = require('../Models/User');
const requireAuth = require('../authToken');

const router = express.Router();

// POST create a new order
router.post('/orders', async (req, res) => {
  const { userId, products, quantities, totalPrice } = req.body;

  try {
    // Check if products and quantities are arrays and have the same length
    if (!Array.isArray(products) || !Array.isArray(quantities) || products.length !== quantities.length) {
      return res.status(400).json({ message: 'Invalid products or quantities' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if all products exist and calculate total price
    let total = 0;
    const productsExist = await Promise.all(products.map(async (productId, index) => {
      const product = await Product.findById(productId);
      if (!product) {
        return false; // Product not found
      }
      total += product.price * quantities[index];
      return true; // Product found
    }));

    // If any product is not found, return error
    if (productsExist.includes(false)) {
      return res.status(404).json({ message: 'One or more products not found' });
    }

    // Create the order
    const order = new Order({
      user: userId,
      products,
      quantities,
      totalPrice: total,
    });

    // Save the order to the database
    const newOrder = await order.save();

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
