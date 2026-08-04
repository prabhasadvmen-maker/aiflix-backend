const jwt = require("jsonwebtoken");
const Creator = require("../models/creatorModel");

const protectCreator = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = process.env.CREATOR_JWT_SECRET;
      const decoded = jwt.verify(token, secret);

      const creator = await Creator.findById(decoded.id);

      if (!creator) {
        return res.status(401).json({
          success: false,
          message: "Creator account not found.",
        });
      }

      if (!creator.isActive) {
        return res.status(403).json({
          success: false,
          message: "Account deactivated.",
        });
      }

      req.creator = creator;
      next();
    } catch (error) {
      console.error("Creator Auth Error:", error.message);
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

module.exports = { protectCreator };
