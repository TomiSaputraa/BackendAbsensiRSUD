const express = require("express");
const {
  getAbsensi,
  createAbsensi,
  updateAbsensi,
} = require("../controllers/absensiController");
const router = express.Router();

// upload file
const upload = require("../middleware/multerMiddleware");
const validateToken = require("../middleware/validateTokenHandler");
// const validateToken = require("../middleware/validateTokenHandler");

// middleware untuk semua route Absensi
router.use(validateToken);

// All Role
router.get("/", getAbsensi);
// router.post("/create", upload.any("foto_masuk"), createAbsensi);
// router.put("/:id", upload.any("foto_masuk"), updateAbsensi);

module.exports = router;
