const mongoose = require('mongoose');

// Define the Order schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  quantities: [{ type: Number, required: true }],
  totalPrice: { type: Number, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
