const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const router = express.Router();

//POST Registration
router.post('/register', async (req, res) => {
  const { email, password, username, shippingAddress } = req.body;

    //check email and username if exists
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    //encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    //new user object
    const user = new User({
      email,
      password: hashedPassword,
      username,
      shippingAddress,
    });

    await user.save();

    res.status(201).json({ message: 'register successfull' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//POST login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email!' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password!' });
      }

      const token = jwt.sign({ userId: user._id }, 'key', { expiresIn: '1d' });
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // PUT edit user details
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { email, username, shippingAddress } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { email, username, shippingAddress },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
