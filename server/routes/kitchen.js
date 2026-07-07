import express from "express";

import {
  getKitchenItems,
  saveConsumption,
  getTodayConsumption,
} from "../controllers/kitchenController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// Today's Kitchen Inventory
router.get("/", getKitchenItems);

// Today's Consumption History
router.get("/consumption", getTodayConsumption);

// Save Consumption
router.post("/consumption", saveConsumption);

export default router;