import express from "express";
import {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from "../controllers/purchaseController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getPurchases);

router.get("/:id", protect, getPurchase);

router.post("/", protect, createPurchase);

router.put("/:id", protect, updatePurchase);

router.delete("/:id", protect, deletePurchase);

export default router;