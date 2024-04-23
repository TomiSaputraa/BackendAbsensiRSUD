const express = require("express");
const { systemConfig } = require("../controllers/adminController");
const router = express.Router();

router.get("/config", systemConfig);

module.exports = router;
