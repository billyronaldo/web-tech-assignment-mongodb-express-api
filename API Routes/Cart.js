const express = require('express');
const Cart = require('../Models/Cart');
const Product = require('../Models/Product');
const User = require('../Models/User');

const router = express.Router();

// GET cart for a specific user
router.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('products');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/cart/add', async (req, res) => {
    const { productId, userId, quantity } = req.body;
  
    try {
      const user = await User.findById(userId);
      const product = await Product.findById(productId);
  
      if (!user || !product) {
        return res.status(404).json({ message: 'User or product not found' });
      }
  
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        // Create a new cart if one doesn't exist for the user
        cart = new Cart({ user: userId, products: [], quantities: [] });
      }
  
      // Check if the product is already in the cart
      const index = cart.products.indexOf(productId);
      if (index !== -1) {
        // If exists add the quantity
        cart.quantities[index] += quantity;
      } else {
        // If it is not in the cart, add it
        cart.products.push(productId);
        cart.quantities.push(quantity);
      }
  
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
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the product to remove
    const indexToRemove = cart.products.findIndex(product => product._id.toString() === productId);

    if (indexToRemove === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Remove the product from products and quantities arrays
    cart.products.splice(indexToRemove, 1);
    cart.quantities.splice(indexToRemove, 1);

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/cart/updateQuantity', async (req, res) => {
  const { productId, userId, newQuantity } = req.body;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Convert ObjectId instances to strings for comparison
    const productIds = cart.products.map(product => product.toString());

    // Update the quantity for the given productId
    const index = productIds.findIndex(id => id === productId);
    if (index !== -1) {
      cart.quantities[index] = newQuantity;
      await cart.save();
      res.json(cart);
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
