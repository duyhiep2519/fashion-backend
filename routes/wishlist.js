import express from "express";
import { verifyUser } from "../middleware/auth.js";
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
} from "../controllers/wishlist.js";

const router = express.Router();
router.get("/", verifyUser, getUserWishlist);
router.post("/addToWishlist", verifyUser, addToWishlist);
router.delete("/removeFromWishlist", verifyUser, removeFromWishlist);

export default router;
