import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      minLength: 3,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    photo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

Schema.pre("save", async function (req, res, next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model("User", Schema);
