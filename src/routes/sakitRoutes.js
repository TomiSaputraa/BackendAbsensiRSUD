const express = require("express");
const {
  getSakit,
  createSakit,
  updateSakit,
} = require("../controllers/sakitController");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

// upload file
const storageMiddleware = require("../middleware/multerMiddleware");

// Upload file middleware
const dynamicPath = "uploads/foto/sakit";
const upload = storageMiddleware(dynamicPath);

// Token validation
router.use(validateToken);

// Routes
router.post("/create", upload.any("foto_masuk"), createSakit);
router.put("/:id", upload.any("foto_masuk"), updateSakit);
router.get("/", getSakit);

module.exports = router;
