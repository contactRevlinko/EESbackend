const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const connectDB = require("./config/db");
const port = process.env.PORT || 5001;
const serverType = "Web Backend";
connectDB();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// ✅ CORS Middleware — Allow all origins
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    server: "Web Backend",
    message: "Web backend server is running",
    port: port,
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/", require("./routes/indexRoute"));

app.listen(port, (err) => {
  if (err) {
    console.error(`[${serverType}] Error starting server:`, err);
    process.exit(1);
  }
  console.log(`[${serverType}] Server is running on port ${port}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`[${serverType}] Uncaught Exception:`, err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error(`[${serverType}] Unhandled Rejection:`, err);
  process.exit(1);
});
