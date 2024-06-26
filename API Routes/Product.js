const express = require('express');
const Product = require('../Models/Product');
const authToken = require('../authToken');

const router = express.Router(); 
//GET Products
 router.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
//POST Proudcts
  router.post('/products', async (req, res) => {
    //new product object
    const product = new Product({
        name: req.body.name,
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

  //Delete Products
  router.delete('/products/:id', (req, res) => {
      Product.findByIdAndDelete(req.params.id)
        .then(() => res.json({message: "product deleted"}))
        .catch((err) => res.status(400).json('Error: ' + err));
    });

    // PUT update product
router.put('/products/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          description: req.body.description,
          image: req.body.image,
          pricing: req.body.pricing,
          shippingCost: req.body.shippingCost,
        },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // GET product details by ID
router.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  
    module.exports = router;

  