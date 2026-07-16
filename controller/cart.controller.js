const AppError = require("../errors/AppError");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const catchAsync = require("../utils/catchAsync");

const addToCart = catchAsync(async(req, res, next)=> {
    const { productId } = req.body
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError("Please signup or login to continue shopping", 401))
    }
  
    // fetch product from dataBase
    const product = await productModel.findById(productId);
  
    if (!product) {
      return next(new AppError("Product not found", 404))
    }

  //Set default quantity
    const quantity = 1;

  // check if stock is enough
  if (product.quantity < quantity) {
    return next("Out of stock", 404)
  }
  
    // find user's cart
    let cart = await cartModel.findOne({user: userId});
    if (!cart) {
      cart = await cartModel.create({
        user: userId,
        items: [
          { product: product._id, 
            quantity
          }
        ]
      });
    }else {
      const existingItemIndex = cart.items.findIndex(item=> item.product.toString()=== productId);
  
      if(existingItemIndex > -1 ) {
        cart.items[existingItemIndex].quantity += quantity;
      }else {
        cart.items.push({
          product: product._id,
          quantity: quantity
        });
      }
  
      await cart.save()
    }

    res.status(200).json({
      message: "Added to cart Succefully", 
      cart
    });
});

const fetchCart = catchAsync(async (req, res, next) => {
    const userId = req.user?.id; 
    const cart = await cartModel.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    // 🔥 Remove items whose product no longer exists
    const validItems = cart.items.filter(item => item.product);

    // Only update DB if something was removed
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    return res.status(200).json(cart);
});

const removeCart = catchAsync(async (req, res, next) => {
    const userId = req.user.id
    const {id} = req.params

    const updatedCart = await cartModel.findOneAndUpdate(
      {user: userId, "items._id": id},
      {$pull: {items: {_id: id}}},
      {new: true}
    )
    if (!updatedCart) {
      return next(new AppError("Item not found", 404))
    }
    return res.status(200).json({
      status: "success",
      message: "Product removed from cart"
    });
});

const updateQuantity = catchAsync(async (req, res, next) => {
    const userId = req.user.id
    const { id } = req.params
    const { quantity } = req.body

    const updatedCart = await cartModel.findOneAndUpdate(
      { user: userId, "items._id": id}, 
      {$set: {"items.$.quantity": quantity} }, 
      { new: true}
    );

    if (!updatedCart) {
      return next(new AppError("Item not found", 404));
    }

    return res.status(200).json({
      status: "success",
      message: "Quantity updated"
    })
});

module.exports= { addToCart, fetchCart, removeCart, updateQuantity }