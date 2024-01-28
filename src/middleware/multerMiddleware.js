const multer = require("multer");

// Set up static storage for uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const currentDate = new Date();
//     const formattedTime = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
//     const formattedDate = currentDate
//       .toISOString()
//       .replace(/:/g, "-")
//       .split("T")[0];
//     cb(null, formattedDate + "-" + formattedTime + "-" + file.originalname);
//   },
// });

// // Create the multer instance
// const upload = multer({ storage: storage });

// module.exports = upload;

// Dynamic path upload folder
// const multer = require("multer");

// Buat fungsi middleware dengan parameter untuk jalur penyimpanan

const storageMiddleware = (destination) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination); // Gunakan jalur penyimpanan yang diterima dari luar
    },
    filename: (req, file, cb) => {
      const currentDate = new Date();
      const formattedTime = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
      const formattedDate = currentDate
        .toISOString()
        .replace(/:/g, "-")
        .split("T")[0];
      cb(null, formattedDate + "-" + formattedTime + "-" + file.originalname);
    },
  });

  return multer({ storage: storage });
};

module.exports = storageMiddleware;
