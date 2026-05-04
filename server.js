import express from "express";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import menuRoutes    from "./backend/routes/menu.js";
import orderRoutes   from "./backend/routes/orders.js";
import authRoutes    from "./backend/routes/auth.js";
import paymentRoutes from "./backend/routes/payment.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "backend", ".env") });

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: "*" } });

app.set("io", io);
app.use(cors({
  origin: (origin, cb) => cb(null, true),
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

const distDir = path.join(__dirname, "dist");
const indexHtml = path.join(distDir, "index.html");

if (fs.existsSync(indexHtml)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path.startsWith("/api") || req.path.startsWith("/socket.io")) return next();
    res.sendFile(indexHtml, (err) => (err ? next(err) : undefined));
  });
} else {
  app.get("/", (_req, res) =>
    res.json({ message: "Zangos API — run npm run build to serve the React app from this host." })
  );
}

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