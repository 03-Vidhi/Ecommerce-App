import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getAllOrdersController,
  getOrdersController,
  orderStatusController
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middlewares/auth.js";

//router object
const router = express.Router();

// routing ->
// REGISTER
router.post("/register", registerController);
// login
router.post("/login", loginController);
// forgot password
router.post("/forgot-password", forgotPasswordController)
//test routes
router.get("/test", requireSignIn, isAdmin, testController);
// protected admin route 
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ok: true});
})
// protected  admin route 
router.get("/admin-auth", requireSignIn, isAdmin , (req, res) => {
  res.status(200).send({ok: true});
})

// update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
