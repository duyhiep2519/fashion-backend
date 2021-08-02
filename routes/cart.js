import express from "express";
import { verifyUser } from "../middleware/auth.js";
import {
  addToCart,
  getCartInfo,
  removeItemFromCart,
  changeQuantityFromCart,
} from "../controllers/cart.js";

const router = express.Router();
router.put("/addToCart", verifyUser, addToCart);
router.get("/cartInfo", verifyUser, getCartInfo);
router.put("/changeQuantityFromCart", verifyUser, changeQuantityFromCart);
router.put("/removeItemFromCart", verifyUser, removeItemFromCart);

export default router;
