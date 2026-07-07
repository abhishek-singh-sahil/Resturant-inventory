import express from "express";
import { ensureTodayInventory } from "../middleware/dayRollover.js";
import {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from "../controllers/purchaseController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);
router.use(ensureTodayInventory);
router.get("/", getPurchases);

router.get("/:id", getPurchase);

router.post("/", createPurchase);

router.put("/:id", updatePurchase);

router.delete("/:id", deletePurchase);

export default router;