const express = require("express");
const {
  getAbsensi,
  createAbsensi,
  updateAbsensi,
} = require("../controllers/absensiController");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

// upload file
const storageMiddleware = require("../middleware/multerMiddleware");

// Token validation
router.use(validateToken);

// Upload file middleware
const dynamicPath = "uploads/foto/absensi";
const upload = storageMiddleware(dynamicPath);

// Routes
router.post("/create", upload.any("foto_masuk"), createAbsensi);
router.put("/:id", upload.any("foto_masuk"), updateAbsensi);
router.get("/", getAbsensi);

module.exports = router;
