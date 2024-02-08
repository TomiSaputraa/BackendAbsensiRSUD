const express = require("express");
const errorHandler = require("./src/middleware/errorHandler");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3001;

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // maksimal 100 permintaan dalam 15 menit
});

// middleware
app.use(limiter);
app.use(helmet()); // security
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// middleware routes
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/absensi", require("./src/routes/absensiRoutes"));
app.use(errorHandler);

app.listen(port, (error) => {
  if (error) {
    throw new Error(error);
  }
  console.log(`Server berhasil berjalan di port : ${port}`);
});
