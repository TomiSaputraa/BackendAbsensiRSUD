const expressAsyncHandler = require("express-async-handler");

const systemConfig = expressAsyncHandler(async (req, res) => {
  const date = new Date();

  const config = {
    date: date.toISOString(),
    version: "1.0.0",
  };

  res.status(200).json(config);
});

module.exports = { systemConfig };
