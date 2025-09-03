import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import ApiRoute from "./src/routes/index.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { NotFound } from "./src/Errors/index.js";
import { dbconnection } from "./src/models/connection.js";
// import "./utils/birthDateCron.js";

dotenv.config();

const app = express();

// لحل مشكلة __dirname مع ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// اتصال قاعدة البيانات
dbconnection();

// Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working! notify token" });
});

// API routes
app.use("/api", ApiRoute);

// 404 handler
app.use((req, res, next) => {
  throw new NotFound("Route not found");
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
