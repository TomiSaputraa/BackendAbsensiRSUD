const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  getCuti,
  createCuti,
  updateCuti,
} = require("../controllers/cutiController");

// Token validation
router.use(validateToken);

// Routes
router.post("/create", createCuti);
router.put("/:id", updateCuti);
router.get("/", getCuti);

module.exports = router;
