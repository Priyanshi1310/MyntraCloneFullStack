// Cart Routes
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.createCart);
router.put('/:userId', cartController.updateCart);
router.get('/:userId', cartController.getCartByUserId);
router.delete('/:userId/:productId', cartController.deleteProductFromCart);
router.delete('/:userId', cartController.clearCart);

module.exports = router;