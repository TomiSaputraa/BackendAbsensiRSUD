const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.status(401);
          throw new Error("User tidak authorized atau token expire");
        }
        req.user = decoded.user;
        next();
      });
    } else if (!authHeader) {
      res.status(401);
      throw new Error("Tidak ada token yang tersedia");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = validateToken;
