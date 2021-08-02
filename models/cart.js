import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      red: "User",
    },
    totalPrice: { type: Number },
    address: { type: String, ref: "address" },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
        shipper: { type: Schema.Types.ObjectId, ref: "Shipper" },
        orderState: {
          pending: { type: Boolean },
          shipped: { type: Boolean },
          delivered: { type: Boolean },
          returned: { type: Boolean },
          refunded: { type: Boolean },
        },
      },
    ],
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
