const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getAllAbsensiById,
} = require("../controllers/userControllers");
const validateToken = require("../middleware/validateTokenHandler");
const storageMiddleware = require("../middleware/multerMiddleware");
const router = express.Router();
const dynamicPath = "uploads/foto/profile";
const upload = storageMiddleware(dynamicPath);

// Routes
router.post("/login", loginUser);
router.get("/", validateToken, getUsers);
router.get("/:id", validateToken, getUserById);
router.get("/history/absensi", validateToken, getAllAbsensiById);
router.post("/create", validateToken, upload.any("foto_masuk"), createUser);
router.patch("/:id", validateToken, upload.any("foto_masuk"), updateUser);
router.delete("/:id", validateToken, deleteUser);

module.exports = router;
