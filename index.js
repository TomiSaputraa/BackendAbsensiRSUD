const express = require("express");
const { errorHandler } = require("./src/middleware/errorHandler");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());
// gunakan ini agar file hasil upload bisa di akses di browser
app.use("/uploads", express.static("uploads"));

app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/absensi", require("./src/routes/absensiRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server berhasil berjalan di port : ${port}`);
});
