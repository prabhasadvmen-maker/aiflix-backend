const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret);

      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User account not found.",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Account deactivated.",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("User Auth Error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed or expired.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided.",
    });
  }
};

module.exports = { protectUser };
