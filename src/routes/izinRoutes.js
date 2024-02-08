const express = require("express");
const {
  createIzin,
  updateIzin,
  getIzin,
} = require("../controllers/izinController");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);

router.post("/create", createIzin);
router.put("/:id", updateIzin);
router.get("/", getIzin);

module.exports = router;
