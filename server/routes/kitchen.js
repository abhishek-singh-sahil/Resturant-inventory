import express from "express";

import {
  getKitchenItems,
  updateKitchenClosing,
} from "../controllers/kitchenController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getKitchenItems);

router.put("/:id/closing", updateKitchenClosing);

export default router;