import express from "express";
import { ensureTodayInventory } from "../middleware/dayRollover.js";
import {
  getKitchenItems,
  saveConsumption,
  getTodayConsumption,
} from "../controllers/kitchenController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.use(ensureTodayInventory);

// Today's Kitchen Inventory
router.get("/", getKitchenItems);

// Today's Consumption History
router.get("/consumption", getTodayConsumption);

// Save Consumption
router.post("/consumption", saveConsumption);

export default router;