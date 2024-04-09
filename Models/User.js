// Define Member Schema
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  shippingAddress: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
