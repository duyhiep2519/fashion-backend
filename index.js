import express from "express";

import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
//router
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import cartRouter from "./routes/cart.js";
import wishlistRouter from "./routes/wishlist.js";
const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express();

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    // rejectUnauthorized: false,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.error(err));
mongoose.set("useFindAndModify", false);

app.use(bodyParser.json());
app.use(cookieParser("secrect"));
app.use(express.static("public"));
app.use(cors());
app.options("*", cors());

app.use(function (req, res, next) {
  res.header("application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});

// server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
