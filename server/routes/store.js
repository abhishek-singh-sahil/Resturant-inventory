import express from "express";
import { ensureTodayInventory } from "../middleware/dayRollover.js";
import {
  getStoreItems,
  getStoreStock,
  updateStoreClosing,
} from "../controllers/storeController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.use(ensureTodayInventory);

// Today's Store Inventory
router.get("/", getStoreItems);

// Store Stock Summary
router.get("/stock", getStoreStock);

// Update Closing Weight (Auto-calculates transfer)
router.put("/:id/closing", updateStoreClosing);

export default router;