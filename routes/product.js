import express from "express";
import {
  getProductsByPage,
  getDetailProduct,
  getListSale,
} from "../controllers/product.js";

const router = express.Router();
router.get("/", getProductsByPage);
router.get("/detail", getDetailProduct);
router.get("/sale", getListSale);

export default router;
