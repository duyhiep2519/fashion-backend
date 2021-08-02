import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";

export const addToCart = (req, res) => {
  const userId = req.user._id;
  const productId = req.query.productId;

  const item = {
    product: productId,
    quantity: req.body.orderQuantity === null || 0 ? 1 : req.body.orderQuantity,
    orderState: {
      pending: true,
      shipped: false,
      delivered: false,
      returned: false,
      refunded: false,
    },
  };
  Product.findById(productId, (err, foundProduct) => {
    if (foundProduct.numberInStock === 0) {
      return res
        .status(400)
        .json({ message: "The product went out of stock!" });
    } else {
      addToCart();
    }
  });

  // add an item to cart
  function addToCart() {
    // 1- find the cart by user's id and if it's there step 2
    Cart.findOne({ user: userId }, (err, foundCart) => {
      if (err) {
        res.status(400).json({
          message: "Couldn't find user cart",
          err,
        });
      } else if (foundCart) {
        let productsInCart = foundCart.items.map((item) => item.product);

        // 2- check if the item already in the cart, if it's there
        if (productsInCart.includes(productId)) {
          //if the user add it without a quantity
          // then notify him it's already in cart
          if (!req.body.orderQuantity) {
            res.status(400).json({
              message: "Product already in cart",
            });
          } else {
            // if he ordered it again from inside the product itself
            // and change the quantity, update the quantity with the new one
            Cart.findOneAndUpdate(
              {
                user: userId,
                items: {
                  $elemMatch: { product: productId },
                },
              },
              { $set: { "items.$.quantity": req.body.orderQuantity } },
              { new: true, useFindAndModify: false },
              (err, cart) => {
                if (err) {
                  res.status(400).json({
                    message: "Couldn't add to cart",
                    err,
                  });
                } else {
                  res.status(200).json(cart);
                }
              }
            );
          }
        } else {
          // 3- if the item isn't in the cart, push it in cart items
          foundCart.items.push(item);
          foundCart.save().then((cart) => {
            res.status(200).json(cart);
          });
        }
      } else {
        // 4- if there isn't a cart for this user
        // create a new one with his id and push the item in the cart
        Cart.create({ user: userId, items: [item] })
          .then((cart) => {
            res.status(200).json(cart);
          })
          .catch((err) => {
            res.status(400).json({
              message: "Couldn't add to cart",
              err,
            });
          });
      }
    });
  }
};

//get cart info
export const getCartInfo = (req, res) => {
  let userId = req.user._id;

  Cart.findOne({ user: userId })
    .populate("items.product")
    .exec((err, cart) => {
      if (err) {
        res.status(400).json(err);
      } else {
        if (!cart) {
          res.status(400).json({ message: "No cart" });
        } else {
          let cartItems = cart.items;
          let total = cartItems.reduce(function (a, b) {
            return a + b.product.price * b.quantity;
          }, 0);

          Cart.findOneAndUpdate(
            { user: userId },
            { totalPrice: total },
            { new: true, useFindAndModify: false }
          )
            .populate("items.product")
            .then((cart) => {
              res.status(200).json(cart);
            });
        }
      }
    });
};

//removeItemFromCart

export const removeItemFromCart = (req, res) => {
  const userId = req.user._id,
    productId = req.query.productId;
  Cart.findOneAndUpdate(
    { user: userId },
    { $pull: { items: { product: productId } } },
    { new: true, useFindAndModify: false },
    (err) => {
      if (err) {
        res.status(400).json(err);
      } else {
        //  populate the cart products
        Cart.findOne({ user: userId })
          .populate("items.product")
          .exec((err, cart) => {
            if (err) {
              res.status(400).json(err);
            } else {
              // count the new total price of the order
              let cartItems = cart.items;
              let total = cartItems.reduce(function (a, b) {
                return a + b.product.price * b.quantity;
              }, 0);

              //  find the same cart and update the total price
              Cart.findOneAndUpdate(
                { user: userId },
                { totalPrice: total },
                { new: true, useFindAndModify: false }
              )
                .populate("items.product")
                .then((cart) => {
                  res.status(200).json(cart);
                });
            }
          });
      }
    }
  );
};

// change quantity from cart
export const changeQuantityFromCart = (req, res) => {
  const userId = req.user._id;

  const productId = req.query.productId;
  Cart.findOneAndUpdate(
    {
      user: userId,
      items: {
        $elemMatch: { product: productId },
      },
    },
    { $set: { "items.$.quantity": req.body.orderQuantity } },
    { new: true, useFindAndModify: false },
    (err, cart) => {
      if (err) {
        res.status(400).json(err);
      } else {
        Cart.findOne({ user: userId })
          .populate("items.product")
          .exec((err, cart) => {
            if (err) {
              res.status(400).json(err);
            } else {
              if (!cart) {
                res.status(400).json({ message: "No cart" });
              } else {
                let cartItems = cart.items;
                let total = cartItems.reduce(function (a, b) {
                  return a + b.product.price * b.quantity;
                }, 0);

                Cart.findOneAndUpdate(
                  { user: userId },
                  { totalPrice: total },
                  { new: true, useFindAndModify: false }
                )
                  .populate("items.product")
                  .then((cart) => {
                    res.status(200).json(cart);
                  });
              }
            }
          });
      }
    }
  );
};
