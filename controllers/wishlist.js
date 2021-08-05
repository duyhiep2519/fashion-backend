import { Wishlist } from "../models/wishlist.js";

export const addToWishlist = (req, res) => {
  const user = req.user._id;
  const item = {
    product: req.query.productId,
  };
  Wishlist.findOne({ user: user }, (err, foundWishlist) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else if (foundWishlist) {
      let productsInWishlist = foundWishlist.items.map((item) => item.product);
      if (productsInWishlist.includes(item.product)) {
        res.status(400).json({ message: "Product has been added to Wishlist" });
      } else {
        foundWishlist.items.push(item);
        foundWishlist.save().then((response) => {
          res.status(200).json(response);
        });
      }
    } else {
      Wishlist.create({ user: user, items: [item] })
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((err) => {
          res.status(400).json({ message: err.message });
        });
    }
  });
};

export const getUserWishlist = (req, res) => {
  let user = req.user._id;
  Wishlist.findOne({ user: user })
    .populate("items.product")
    .exec((err, wishlist) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        if (!wishlist) {
          res.status(400).json({ message: "No wishlist found" });
        } else {
          res.status(200).json(wishlist);
        }
      }
    });
};

export const removeFromWishlist = (req, res) => {
  const userId = req.user._id,
    productId = req.query.productId;

  Wishlist.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { product: productId } } },
    { new: true, useFindAndModify: false },
    (err) => {
      if (err) {
        res.status(400).json({ message: "Couldn't find wish list", err });
      } else {
        // populate the cart products again
        Wishlist.findOne({ user: userId })
          .populate("items.product")
          .exec((err, wishlist) => {
            if (err) {
              res.status(400).json({ message: "Couldn't find wish List", err });
            } else {
              res.status(200).json(wishlist);
            }
          });
      }
    }
  );
};
