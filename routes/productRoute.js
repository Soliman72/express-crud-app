const express = require("express");
const productController = require("./../controller/productController");
const {authenticateUser , isAdmin} = require("../middlewares/authMiddleware");


const router = express.Router();

router.post("/create", authenticateUser, productController.createProduct);
router.get("/", authenticateUser, productController.getAllProducts);
router.put("/:id", isAdmin, productController.updateProduct);
router.delete("/:id", isAdmin, productController.deleteProduct);
module.exports = router;
