import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.js";
import {
  createCategoryController,
  updateCategoryController,
  categoryController,
  singleCategoryController,
  deleteCategoryController
} from "../controllers/createCategoryController.js";

const router = express.Router();

// routes
// create-category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController,

);
// update-category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);
//getAll category
router.get("/get-category", categoryController);
// get single category
router.get("/single-category/:slug", singleCategoryController);
// delete category
router.delete("/delete-category/:id", deleteCategoryController);

export default router;
