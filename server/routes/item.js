import express from "express";
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Item Routes
|--------------------------------------------------------------------------
*/

router
  .route("/")
  .get(protect, getItems)
  .post(protect, adminOnly, createItem);

router
  .route("/:id")
  .get(protect, getItem)
  .put(protect, adminOnly, updateItem)
  .delete(protect, adminOnly, deleteItem);

export default router;