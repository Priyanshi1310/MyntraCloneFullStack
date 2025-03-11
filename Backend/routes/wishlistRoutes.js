const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", wishlistController.createWishlist);
router.put("/:userId", wishlistController.updateWishlist);
router.get("/:userId", wishlistController.getWishlistByUserId);
router.delete("/:userId/:productId",wishlistController.deleteProductFromWishlist);
router.delete("/:userId", wishlistController.clearWishlist);

module.exports = router;