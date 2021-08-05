import mongoose from "mongoose";
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    },
  ],
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
