import mongoose from "mongoose";
import slug from "mongoose-slug-generator";

mongoose.plugin(slug);
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sale: {
      type: Number,
    },
    isNewProduct: {
      type: Boolean,
    },
    category: {
      type: String,
    },
    tag: {
      type: String,
    },
    image: {
      type: Array,
      required: true,
    },
    slug: {
      type: "string",
      slug: "name",
      unique: true,
      required: true,
    },
    numberInStock: { type: Number, required: true },
  },
  { timestamps: true }
);
ProductSchema.virtual("url").get(function () {
  return "/product/" + this._id;
});

export const Product = mongoose.model("Product", ProductSchema);
