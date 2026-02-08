import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/config/db.js";
import errorHandler from "./src/middleware/error.middleware.js";

import authRoutes from "./src/routes/auth.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import ticketRoutes from "./src/routes/ticket.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import subRoutes from "./src/routes/sub.routes.js";

// ================== __dirname for ES modules ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== App init ==================
const app = express();

// ================== Middleware ==================
app.use(cors());
app.use(express.json());

// ================== API routes ==================
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscribe", subRoutes);

// ================== Frontend ==================
const frontendPath = path.join(__dirname, "frontend");

// Раздаём ВСЕ HTML, CSS, JS, MP3 автоматически
app.use(express.static(frontendPath));

// Главная страница
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "willy.html"));
});

// ================== Error handler ==================
app.use(errorHandler);

// ================== Start server ==================
const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

startServer(); // вызываем отдельно


