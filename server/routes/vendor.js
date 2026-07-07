import express from "express";
import {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../controllers/vendorController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Vendor Routes
|--------------------------------------------------------------------------
*/

router
  .route("/")
  .get(protect, getVendors)
  .post(protect, adminOnly, createVendor);

router
  .route("/:id")
  .get(protect, getVendor)
  .put(protect, adminOnly, updateVendor)
  .delete(protect, adminOnly, deleteVendor);

export default router;