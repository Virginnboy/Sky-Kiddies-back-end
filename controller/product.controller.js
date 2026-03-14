const productModel = require("../models/product.model");

const createProduct = async (req, res) => {
  
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized: Admin only"
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one image"
      });
    }

    const images = req.files.map(file => file.path);
    const { title, description, price, quantity } = req.body;

    const newProduct = await productModel.create({
      title,
      description,
      price,
      quantity,
      images
    });

    return res.status(201).json({
      message: "Uploaded successfully",
      product: newProduct
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

const fetchProduct = async (req, res)=> {
  const search = req.query.search || "";
  const regex = search.split("").map(l => `(?=.*${l})`).join("");
  
  try {
    const products = await productModel.find({
      title: { $regex: regex, $options: "i"},
    });
    return res.status(200).json(products);
  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Failed to fetch products"})
  }; 
}

const fetchProductDetails = async (req, res) => {
  const id = req.params.id
  try {
    const product = await productModel.findById(id)

    if (!product) {
      return res.status(401).json({message: "Product not found"})
    }

    return res.status(200).json(product)
  }catch (err) {
    res.status(500).json({message: "Server error"})
  }
}

const deleteProduct = async (req,res)=> {
  const id = req.params.id;
  try {
    const response = await productModel.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({message: "Product not found"});
    }
    res.status(200).json({message: "Product deleted"})
  }catch (err) {
    return res.status(500).json({message: "Server error"});
  }
}

const editProduct = async (req, res)=> {
  const id = req.params.id;
  const { title, description, price, quantity } = req.body
  const images = req.files.map(file=> file.path);
  try {
  const updatedProduct = await productModel.findByIdAndUpdate(id, {$set:  {title, description, price, quantity, images } }, {new: true});

    return res.status(200).json(updatedProduct)
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: "Updated failed"})
  }
};

const searchProducts = async (req, res)=> {
  const search = req.query.search || "";

  try {

    const products = await productModel.find({
      name: { $regex: search, $options: "i"}
    });

    return res.status(200).json(products)

  } catch (err) {
    console.log(err)
    return res.status(500).json({message: "Server error"})
  }
};

module.exports = { createProduct, fetchProduct, fetchProductDetails, deleteProduct, editProduct, searchProducts };
