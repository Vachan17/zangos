import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import menuRoutes    from "./backend/routes/menu.js";
import orderRoutes   from "./backend/routes/orders.js";
import authRoutes    from "./backend/routes/auth.js";
import paymentRoutes from "./backend/routes/payment.js";

dotenv.config({ path: "./backend/.env" });

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: "*" } });

app.set("io", io);
app.use(cors({
  origin: (origin, cb) => cb(null, true), // allow all origins; restrict to your Vercel URL in production if needed
  credentials: true,
}));
app.use((req, res, next) => {
  // Keep raw body for Cashfree webhook signature verification
  if (req.path === "/api/payment/webhook") return next();
  express.json()(req, res, next);
});

app.use("/api/menu",    menuRoutes);
app.use("/api/orders",  orderRoutes);
app.use("/api/auth",    authRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => res.json({ message: "Zangos API running 🔥" }));

io.on("connection", (socket) => {
  console.log("🟢 Employee/Client connected:", socket.id);
  socket.on("join_employee", () => socket.join("employees"));
  socket.on("order_status_update", (data) => io.emit("order_updated", data));
  socket.on("disconnect", () => console.log("🔴 Disconnected:", socket.id));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected to:", process.env.MONGO_URI);
    server.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error("❌ MongoDB connection error:", err.message));