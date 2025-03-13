const productRoutes = require("express").Router();
const ProductController = require("../controllers/ProductController");
const verifyAccessToken = require("../middleware/verifyAccessToken");

productRoutes.get("/", ProductController.getAllProducts);
productRoutes.get("/:id", ProductController.getProductById);
productRoutes.post("/", ProductController.createProduct);
productRoutes.put("/:id", verifyAccessToken, ProductController.updateProduct);
productRoutes.delete("/:id", ProductController.deleteProduct);
productRoutes.get("/seller/:userId", ProductController.getSellerProducts);
productRoutes.post("/cart", ProductController.addToCart);

module.exports = productRoutes;
