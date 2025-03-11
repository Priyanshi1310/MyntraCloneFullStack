const mongoose = require('mongoose');
// models/Wishlist.js
const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
    },
  ],
});
module.exports = mongoose.model('Wishlist', WishlistSchema);