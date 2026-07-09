import express from "express";

import {
  getCurrentBusinessDay,
  rolloverBusinessDay,
} from "../controllers/systemController.js";

import {
  protect,
  adminOnly,
} from "../middleware/auth.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                     GET CURRENT BUSINESS DATE                              */
/* -------------------------------------------------------------------------- */

router.get(
  "/day",
  protect,
  getCurrentBusinessDay
);

/* -------------------------------------------------------------------------- */
/*                      START NEXT BUSINESS DAY                               */
/* -------------------------------------------------------------------------- */

router.post(
  "/rollover",
  protect,
  adminOnly,
  rolloverBusinessDay
);

export default router;