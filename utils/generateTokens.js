const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.CREATOR_JWT_SECRET, { expiresIn: "7d" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.CREATOR_JWT_REFRESH_SECRET, { expiresIn: "30d" });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
