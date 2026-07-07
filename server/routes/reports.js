import express from "express";
import {
  getDashboardSummary,
  getStoreReport,
  getKitchenReport,
  getPurchaseReport,
  getTransferReport,
  getConsumptionReport,
} from "../controllers/reportsController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// Dashboard
router.get("/dashboard-summary", getDashboardSummary);

// Reports
router.get("/store", getStoreReport);
router.get("/kitchen", getKitchenReport);
router.get("/purchase", getPurchaseReport);
router.get("/transfer", getTransferReport);
router.get("/consumption", getConsumptionReport);

export default router;