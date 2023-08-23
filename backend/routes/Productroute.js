import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.js";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFilterController,
  productListContoller,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
const router = express.Router();
// routes

// create-product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
// get all product
router.get("/get-product", getProductController);
// get single product
router.get("/get-product/:slug", getSingleProductController);
// get photo
router.get("/product-photo/:pid", productPhotoController);
// delete product
router.delete("/delete-product/:pid", deleteProductController)
// update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// filter the product
router.post("/product-filters", productFilterController);

// product count
router.get("/product-count", productCountController);

// product per page
router.get("/product-list/:page", productListContoller);

// search product
router.get("/search/:keyword", searchProductController);

// similar product
router.get("/related-product/:pid/:cid", relatedProductController);

router.get("/product-category/:slug", productCategoryController);

// payment
// token
router.get("/braintree/token", braintreeTokenController);

// paymnets
router.post("/braintree/payment", braintreePaymentController);

export default router;
