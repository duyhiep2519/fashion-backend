import express from "express";
import {
  getProductsByPage,
  getDetailProduct,
  getListSale,
  filterProduct,
  getProductByFilter,
} from "../controllers/product.js";

const router = express.Router();
router.get("/", getProductsByPage);
router.get("/detail", getDetailProduct);
router.get("/sale", getListSale);
router.post("/filter", filterProduct);
router.get("/category", getProductByFilter);

export default router;
