const mongoose = require('mongoose');

// models/Product.js
const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  rating:{ rate: { type: Number, default: 0 },
  count: { type: Number, default: 0 },}
});
module.exports = mongoose.model('Product', ProductSchema);