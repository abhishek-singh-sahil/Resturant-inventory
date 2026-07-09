import express from "express";

import {
  getStoreItems,
  getStoreStock,
  updateStoreClosing,
} from "../controllers/storeController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getStoreItems);

router.get("/stock", getStoreStock);

router.put("/:id/closing", updateStoreClosing);

export default router;