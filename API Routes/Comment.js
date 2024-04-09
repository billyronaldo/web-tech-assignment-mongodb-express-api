const express = require('express');
const Comments = require('../Models/Comment');
const Product = require('../Models/Product');
const User = require('../Models/User');

const router = express.Router();

//GET all comments
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comments.find().populate('product user');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//POST a new comment
router.post('/comments', async (req, res) => {
  const { productId, userId, rating, images, text } = req.body;

  try {
    const product = await Product.findById(productId);
    const user = await User.findById(userId);

    if (!product || !user) {
      return res.status(404).json({ message: 'Product or user not found' });
    }

    // Create a new Comment object
    const comment = new Comments({
      product: productId,
      user: userId,
      rating,
      images,
      text,
    });

    const newComment = await comment.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a comment
router.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comments.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (edit) a comment
router.put('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { rating, images, text } = req.body;
  
    try {
      const updatedComment = await Comments.findByIdAndUpdate(
        id,
        { rating, images, text },
        { new: true } // Return the updated comment
      );
  
      if (!updatedComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      res.json(updatedComment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
