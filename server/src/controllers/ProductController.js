const ProductService = require("../services/ProductService");
const ProductValidator = require("../utils/ProductValidator");
const formatResponse = require("../utils/formatResponse");
const CartService = require("../services/CartService");
const UserService = require("../services/UserService");
const reformatId = require("../utils/reformatId");

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAll();
      if (products.length === 0) {
        return res
          .status(204)
          .json(formatResponse(204, "No products found", []));
      }
      res.json(formatResponse(200, "All products", products));
    } catch ({ message }) {
      console.error("Ошибка получения продуктов:", message);
      res
        .status(500)
        .json(formatResponse(500, "Internal Server Error", null, message));
    }
  }

  static async getProductById(req, res) {
    const { id } = req.params;
    try {
      const product = await ProductService.getById(id);
      if (!product) {
        return res.status(404).json(formatResponse(404, "Product not found"));
      }
      res.json(formatResponse(200, "Product found", product));
    } catch ({ message }) {
      console.error("Ошибка получения продукта:", message);
      res
        .status(500)
        .json(formatResponse(500, "Internal Server Error", null, message));
    }
  }

  static async createProduct(req, res) {
    const { title, description, price, article, image, user_id, quantity } =
      req.body;

    const userIdNumber = parseInt(user_id, 10);
    const priceNumber = parseFloat(price);

    const { isValid, error } = ProductValidator.validate({
      title,
      description,
      price: priceNumber,
      article,
      image,
      user_id: userIdNumber,
    });
    if (!isValid) {
      console.error("Ошибка валидации:", error);
      return res
        .status(400)
        .json(formatResponse(400, "Validation error", null, error));
    }
    try {
      const newProduct = await ProductService.create({
        title,
        description,
        price: priceNumber,
        article,
        image,
        user_id: userIdNumber,
        quantity,
      });
      if (!newProduct) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Failed to create product",
              null,
              "Product creation failed"
            )
          );
      }
      res.status(201).json(formatResponse(201, "Product created", newProduct));
    } catch ({ message }) {
      console.error("Ошибка создания продукта:", message);
      res
        .status(500)
        .json(formatResponse(500, "Internal Server Error", null, message));
    }
  }

  static async updateProduct(req, res) {
    const { id } = req.params;
    const user = res.locals.user;
    const user_id = reformatId(user.id);

    const { title, description, price, article } = req.body;

    const priceNumber = parseFloat(price);

    const { isValid, error } = ProductValidator.validate({
      title,
      description,
      price: priceNumber,
      article,
      user_id,
    });
    if (!isValid) {
      console.error("Ошибка валидации:", error);
      return res.status(400).json({ message: "Validation error", error });
    }

    try {
      const updatedProduct = await ProductService.update(id, {
        title,
        description,
        price: priceNumber,
        article,
      });
      if (!updatedProduct) {
        console.error("Продукт не найден или не обновлен");
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updatedProduct);
    } catch ({ message }) {
      console.error("Ошибка обновления продукта:", message);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: message });
    }
  }

  static async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      const deletedProduct = await ProductService.delete(id);
      if (!deletedProduct) {
        return res.status(404).json(formatResponse(404, "Product not found"));
      }
      res.json(formatResponse(200, "Product deleted", deletedProduct));
    } catch ({ message }) {
      console.error("Ошибка удаления продукта:", message);
      res
        .status(500)
        .json(formatResponse(500, "Internal Server Error", null, message));
    }
  }

  static async getSellerProducts(req, res) {
    const { userId } = req.params;
    try {
      const products = await ProductService.getSellerProducts(userId);
      res.json(formatResponse(200, "Seller products", products));
    } catch ({ message }) {
      console.error("Ошибка получения продуктов продавца:", message);
      res
        .status(500)
        .json(formatResponse(500, "Internal Server Error", null, message));
    }
  }

  static async addToCart(req, res) {
    const { userId, productId } = req.body;
    try {
      const user = await UserService.getById(userId);
      if (!user) {
        return res.status(401).json(formatResponse(401, "Unauthorized"));
      }

      const product = await ProductService.getById(productId);
      if (!product) {
        return res.status(404).json(formatResponse(404, "Product not found"));
      }

      if (product.quantity <= 0) {
        return res
          .status(400)
          .json(formatResponse(400, "Product is out of stock"));
      }

      const cartItem = await CartService.create({
        user_id: userId,
        product_id: productId,
      });

      if (!cartItem) {
        return res
          .status(400)
          .json(formatResponse(400, "Failed to add to cart"));
      }

      await ProductService.update(productId, {
        quantity: product.quantity - 1,
      });

      res.json(formatResponse(200, "Added to cart successfully"));
    } catch ({ message }) {
      console.error("Ошибка добавления в корзину:", message);
      res
        .status(500)
        .json(formatResponse(500, "Internal Server Error", null, message));
    }
  }
  
}

module.exports = ProductController;
