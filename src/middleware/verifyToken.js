const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Middleware untuk memverifikasi token
const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers.Authorization || req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: "Tidak ada token tersedia" });
  }

  jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token tidak valid" });
    }

    req.user = decoded.user;
    next();
  });
});

module.exports = verifyToken;
