const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, "4583@Narendra");
    const user = await User.findById(decoded._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user; // Attach user to request for future use
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Invalid token" });
  }
};

module.exports = userAuth;
