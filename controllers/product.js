import { Product } from "../models/product.js";

export const getProductsByPage = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = {};
  if (endIndex < (await Product.countDocuments().exec())) {
    result.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  try {
    result.result = await Product.find().limit(limit).skip(startIndex).exec();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDetailProduct = async (req, res) => {
  const slug = req.query.slug;
  try {
    const product = await Product.findOne({ slug: slug }).exec();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getListSale = async (req, res) => {
  try {
    const listProduct = await Product.find({ sale: { $gte: 0 } });
    res.status(200).json(listProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const filterProduct = async (req, res) => {
  const type = req.query.type,
    search_q = req.query.search_q;

  try {
    const listProduct = await Product.find();
    const result = listProduct.filter(
      (item) =>
        item.category.toLowerCase().split(", ").includes(type) &
        item.name.toLowerCase().includes(search_q)
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
