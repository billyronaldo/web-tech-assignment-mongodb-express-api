const mongoose = require('mongoose');


const commentsSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true }, 
  images: String, 
  text: String, 
});

const Comments = mongoose.model('Comments', commentsSchema);

module.exports = Comments;
