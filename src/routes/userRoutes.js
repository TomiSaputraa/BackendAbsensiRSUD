const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/userControllers");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

// Admin
router.get("/", validateToken, getUsers);
router.get("/:id", validateToken, getUserById);
router.post("/create", createUser);
router.put("/:id", validateToken, updateUser);
router.delete("/:id", validateToken, deleteUser);

// User
router.post("/login", loginUser);

module.exports = router;
