const Product = require("../models/Product");

const product = require("../models/Product");

// CRUD operation create , update , read , delete products
// only admin can update and delete products

// create product
exports.createProduct = async (req, res) => {
  const { name, price, description } = req.body;
  const product = new Product({ name, price, description });
  product.save();
  res.status(201).json({
    message: "success",
    product,
  });
};

// get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ "number of products": products.length, products });
  } catch (error) {
    res.status(500).send(err);
  }
};

// update product by id    /:id   (Admin only can update)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

// delete product by id    /:id     (Admin only can delete)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "product not found" });
    res.status(200).json({ message: "product deleted success" });
  } catch (error) {
    res.status(500).send(error);
  }
};
