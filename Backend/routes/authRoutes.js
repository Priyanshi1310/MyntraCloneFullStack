const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const mongoose = require('mongoose');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get("/current", authMiddleware, authController.getCurrentUser);
router.post("/logout", authController.logoutUser);

module.exports = router;