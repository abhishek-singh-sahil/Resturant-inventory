import express from "express";
import { ensureTodayInventory } from "../middleware/dayRollover.js";
import {
  getStoreItems,
  getStoreStock,
  transferToKitchen,
  updateStoreItem,
  deleteStoreItem,
} from "../controllers/storeController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.use(ensureTodayInventory);

// Today's Store Inventory
router.get("/", getStoreItems);

// Store Stock Summary
router.get("/stock", getStoreStock);

// Transfer Items to Kitchen
router.post("/transfer", transferToKitchen);

// Update Item
router.put("/:id", updateStoreItem);

// Archive Item
router.delete("/:id", deleteStoreItem);

export default router;