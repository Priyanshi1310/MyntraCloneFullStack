const jwt = require("jsonwebtoken");
const User = require("../models/User");


const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization"); // Get token from headers
    if (!token) {
      return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }
  
    try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid Token" });
    }
  };
  
  module.exports = authMiddleware;