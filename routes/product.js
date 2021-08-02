import express from "express";
import { getProductsByPage, getDetailProduct } from "../controllers/product.js";

const router = express.Router();
router.get("/", getProductsByPage);
router.get("/detail", getDetailProduct);

export default router;
