const Wishlist = require('../models/Wishlist');

exports.createWishlist = async (req, res) => {
  try {
    const { userId, products } = req.body;
    let wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      const productIds = wishlist.products.map((p) => p.productId.toString());
      const newProducts = products.filter((p) => !productIds.includes(p.productId));
      wishlist.products = [...wishlist.products, ...products];
    } else {
      wishlist = new Wishlist({ userId, products });
    }
    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { products } = req.body;
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { products },
      { new: true }
    );
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWishlistByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProductFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    if (!wishlist.products || wishlist.products.length === 0) {
      return res.status(400).json({ message: "No products in wishlist" });
    }
    wishlist.products = wishlist.products.filter(p => p.productId.toString() !== productId);
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOneAndDelete({ userId });

    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });
    res.json({ message: 'Wishlist cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
