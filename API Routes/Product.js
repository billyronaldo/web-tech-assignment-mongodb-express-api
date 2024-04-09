const express = require('express');
const Product = require('../Models/Product');

const router = express.Router(); 
 router.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  router.post('/products', async (req, res) => {
    const product = new Product({
        description: req.body.description,
        image: req.body.image,
        pricing: req.body.pricing,
        shippingCost: req.body.shippingCost,
    });
  
    try {
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  router.delete('/products/:id', (req, res) => {
      Member.findByIdAndDelete(req.params.id)
        .then(() => res.json('Product deleted.'))
        .catch((err) => res.status(400).json('Error: ' + err));
    });
  
    module.exports = router;

  