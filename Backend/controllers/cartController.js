const Cart = require('../models/Cart');

// exports.createCart = async (req, res) => {
//   try {
//     const { userId, products } = req.body;
//     let cart = await Cart.findOne({ userId });
//     if (cart) {
//       cart.products = [...cart.products, ...products];
//     } else {
//       cart = new Cart({ userId, products });
//     }
//     await cart.save();
//     res.status(201).json(cart);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createCart = async (req, res) => {
  try {
    const { userId, products } = req.body;

    // Debugging logs
    console.log("Received request body:", req.body);

    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid data. userId and products are required." });
    }

    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Avoid adding duplicate products
      const existingProductIds = new Set(cart.products.map((p) => p.productId.toString()));
      const newProducts = products.filter((p) => !existingProductIds.has(p.productId));
      cart.products = [...cart.products, ...newProducts];
    } else {
      cart = new Cart({ userId, products });
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ userId }).populate("products.productId");
    res.status(201).json(populatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { products } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { products },
      { new: true }
    );
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteProductFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.products = cart.products.filter(p => p.productId !== productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndDelete({ userId });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
