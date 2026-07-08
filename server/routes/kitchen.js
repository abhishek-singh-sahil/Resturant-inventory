import express from "express";
import { ensureTodayInventory } from "../middleware/dayRollover.js";
import {
  getKitchenItems,
  updateKitchenClosing,
} from "../controllers/kitchenController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.use(ensureTodayInventory);

// Today's Kitchen Inventory
router.get("/", getKitchenItems);

// Update Closing Weight (Auto-calculates consumption)
router.put("/:id/closing", updateKitchenClosing);

export default router;