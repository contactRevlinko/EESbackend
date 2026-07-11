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

// const cronScheduler = require("./middleware/cronScheduler");
// cronScheduler();

const resetAllUsersRequests = require("./controllers/checkAndNotifyPayments");
// resetAllUsersRequests();

// Use this to fix the deprecation warning
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const cors = require("cors");
const allowedOrigins = [
  "https://ee-sfrontend.vercel.app",
  "https://ees121.com",
  "https://www.ees121.com",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Allow all ee-sfrontend Vercel preview deployments
    const isVercelPreview = /^https:\/\/ee-sfrontend.*\.vercel\.app$/.test(origin);

    if (allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      console.warn("[CORS] Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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
