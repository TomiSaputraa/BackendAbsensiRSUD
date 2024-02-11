const express = require("express");
const {
  createIzin,
  updateIzin,
  getIzin,
} = require("../controllers/izinController");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

// Token validation
router.use(validateToken);

// Routes
router.post("/create", createIzin);
router.put("/:id", updateIzin);
router.get("/", getIzin);

module.exports = router;
