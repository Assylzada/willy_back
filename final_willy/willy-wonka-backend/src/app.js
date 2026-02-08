// src/app.js
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import orderRoutes from "./routes/order.routes.js";
import subRoutes from "./routes/sub.routes.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscribe", subRoutes);

export default app;
