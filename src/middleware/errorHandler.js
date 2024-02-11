require("dotenv").config();

// dont delete next!
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log("Middleware Error Handling");
  const errStatus = res.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

module.exports = errorHandler;
