const express = require("express");
const {
  getAbsensi,
  createAbsensi,
  updateAbsensi,
} = require("../controllers/absensiController");
const router = express.Router();

// upload file
const upload = require("../middleware/multerMiddleware");

router.get("/", getAbsensi);
router.post("/", upload.any("foto_masuk"), createAbsensi);
router.put("/:id", updateAbsensi);

module.exports = router;
