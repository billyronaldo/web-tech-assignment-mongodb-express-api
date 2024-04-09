const express = require('express');
const Cart = require('../Models/Cart');
const Product = require('../Models/Product');
const User = require('../Models/User');

const router = express.Router();

// GET cart for a specific user
router.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId }).populate('products');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add product to cart
router.post('/cart/add', async (req, res) => {
  const { productId, userId, quantity } = req.body;

  try {
    // Find the user and product
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'User or product not found' });
    }

    // Check if the product is already in the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Create a new cart if one doesn't exist for the user
      cart = new Cart({ user: userId, products: [], quantities: [] });
    }

    cart.products.push(productId);
    cart.quantities.push(quantity);
    await cart.save();

    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE remove product from cart
router.delete('/cart/remove/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Find and update the user's cart
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;