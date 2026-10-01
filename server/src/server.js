const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Chat server is running"
  });
});

app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();