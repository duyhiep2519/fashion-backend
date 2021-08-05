import express from "express";
import {
  getProductsByPage,
  getDetailProduct,
  getListSale,
  filterProduct,
} from "../controllers/product.js";

const router = express.Router();
router.get("/", getProductsByPage);
router.get("/detail", getDetailProduct);
router.get("/sale", getListSale);
router.post("/filter", filterProduct);

export default router;
