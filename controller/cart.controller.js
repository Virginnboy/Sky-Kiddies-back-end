const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");

const addToCart = async(req, res)=> {
  console.log(req.body)
  try {
    const { productId } = req.body
    console.log(productId)
    const userId = req.user?.id;
    console.log(userId)

    if (!userId) {
      return res.status(401).json({message: "Please signup or login to continue shopping"})
    }
  
    // fetch product from dataBase
    const product = await productModel.findById(productId);
  
    if (!product) {
      return res.status(404).json({message: "Product not found"})
    }

  //Set default quantity
    const quantity = 1;

  // check if stock is enough
  if (product.quantity < quantity) {
    return res.status(400).json({ message: "Out of stock" });
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

    return res.status(200).json({message: "Added to cart Succefully", cart})
    
  }catch (err) {
    console.log(err)
    return res.status(500).json({message: "Server Error"})
  }
};

const fetchCart = async (req, res) => {
  try {
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

  } catch (err) {
    console.log(err); 
    return res.status(500).json({ message: "Server Error" });
  }
};

const removeCart = async (req, res) => {
  try {
    const userId = req.user.id
    const {id} = req.params

    const updatedCart = await cartModel.findOneAndUpdate(
      {user: userId, "items._id": id},
      {$pull: {items: {_id: id}}},
      {new: true}
    )
    if (!updatedCart) {
      return res.status(404).json({message: "Item not found"})
    }
    return res.status(200).json({message: "Product removed from cart"})
  }catch (err) {
    console.log(err)
    return res.staus(500).json({message: "Server Error"})
  }
}

const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params
    const { quantity } = req.body

    const updatedCart = await cartModel.findOneAndUpdate(
      { user: userId, "items._id": id}, 
      {$set: {"items.$.quantity": quantity} }, 
      { new: true}
    );

    if (!updatedCart) {
      return res.status(404).json({message: "Item not found"})
    }

    return res.status(200).json({message: "Quantity updated"})
  }catch (err) {
    console.log(err);
    return res.status(500).json({message: "Server Error"})
  }
}

module.exports= { addToCart, fetchCart, removeCart, updateQuantity }