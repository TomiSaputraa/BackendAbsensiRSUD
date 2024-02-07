const express = require("express");
const errorHandler = require("./src/middleware/errorHandler");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// middleware routes
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/absensi", require("./src/routes/absensiRoutes"));
app.use(errorHandler);

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server berhasil berjalan di port : ${port}`);
});
