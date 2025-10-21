import express from "express";
import dotenv from "dotenv";
import connectDB from "./MongoDb/connectDB.js";
import stringRouters from "./Routers/stringRouters.js";
import cors from "cors";


dotenv.config();
const appServer = express();
const PORT = process.env.PORT || 6000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
appServer.use(express.urlencoded({ extended: true }));
appServer.use(express.json());
appServer.use(cors());

// ✅ Routers
appServer.use("/strings", stringRouters);

// ✅ Optional health check
appServer.get("/", (req, res) => {
  res.json({ message: "String Analysis API is running 🚀" });
});

// ✅ 404 Handler
appServer.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global Error Handler
appServer.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ✅ Start Server
appServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
