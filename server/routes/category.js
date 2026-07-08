import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Category Routes
|--------------------------------------------------------------------------
*/

router
  .route("/")
  .get(protect, getCategories)
  .post(protect, adminOnly, createCategory);

router
  .route("/:id")
  .put(protect, adminOnly, updateCategory)
  .delete(protect, adminOnly, deleteCategory);

export default router;
