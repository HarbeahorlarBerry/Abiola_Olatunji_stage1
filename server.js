import express, { urlencoded, json } from "express";
import dotenv from "dotenv";
import connectDB from "./MongoDb/connectdb.js"; // ✅ Correct case
import stringRouters from "./Routers/stringRouters.js";
import cors from "cors";

dotenv.config();
const appServer = express();
const PORT = process.env.PORT || 6000;

// ✅ Connect to MongoDB
connectDB();

appServer.use(urlencoded({ extended: true }));
appServer.use(json());
appServer.use(cors());
appServer.use("/strings", stringRouters);

// 🔹 404 Handler
appServer.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🔹 Global Error Handler
appServer.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ✅ START SERVER
appServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

