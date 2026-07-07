import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import connectDB from "./config/db.js";



import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/item.js";
import vendorRoutes from "./routes/vendor.js";
import purchaseRoutes from "./routes/purchase.js";
import storeRoutes from "./routes/store.js";
import kitchenRoutes from "./routes/kitchen.js";
import reportRoutes from "./routes/reports.js";

dotenv.config();

await connectDB();
// Automatically starts the scheduler
await import("./services/dayScheduler.js");

const app = express();

/* -------------------------------------------------------------------------- */
/*                                   MIDDLEWARE                               */
/* -------------------------------------------------------------------------- */

app.use(
  cors({
    origin: "https://resturant-inventory.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

/* -------------------------------------------------------------------------- */
/*                                    HEALTH                                  */
/* -------------------------------------------------------------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Restaurant Inventory API Running Successfully",
    timestamp: new Date(),
  });
});

/* -------------------------------------------------------------------------- */
/*                                    ROUTES                                  */
/* -------------------------------------------------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/kitchen", kitchenRoutes);
app.use("/api/reports", reportRoutes);

/* -------------------------------------------------------------------------- */
/*                                404 HANDLER                                 */
/* -------------------------------------------------------------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

/* -------------------------------------------------------------------------- */
/*                             GLOBAL ERROR HANDLER                           */
/* -------------------------------------------------------------------------- */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* -------------------------------------------------------------------------- */
/*                                   SERVER                                   */
/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

/* -------------------------------------------------------------------------- */
/*                            GRACEFUL SHUTDOWN                               */
/* -------------------------------------------------------------------------- */

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    try {
      await mongoose.connection.close();

      console.log("MongoDB Connection Closed");

      process.exit(0);
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  });
};

process.on("SIGINT", () =>
  gracefulShutdown("SIGINT")
);

process.on("SIGTERM", () =>
  gracefulShutdown("SIGTERM")
);

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});