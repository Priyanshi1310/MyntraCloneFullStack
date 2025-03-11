const mongoose = require('mongoose');
// models/Cart.js
const CartSchema = new mongoose.Schema({
  userId: String,
  products: [{ productId:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, quantity: Number }],
});
module.exports = mongoose.model('Cart', CartSchema);