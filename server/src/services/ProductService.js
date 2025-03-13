const { Product } = require("../db/models");

class ProductService {
  static async getAll() {
    try {
      const products = await Product.findAll();
      return products;
    } catch (error) {
      console.error("Ошибка получения продуктов:", error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const product = await Product.create(data);
      return await product;
    } catch (error) {
      console.error("Ошибка создания продукта:", error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const product = await Product.findByPk(id);
      return product;
    } catch (error) {
      console.error("Ошибка получения продукта:", error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error("Product not found");
      }
      await product.update(data);
      const updatedProduct = await Product.findByPk(id);
      return updatedProduct;
    } catch (error) {
      console.error("Ошибка обновления продукта:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error("Product not found");
      }
      return await product.destroy();
    } catch (error) {
      console.error("Ошибка удаления продукта:", error);
      throw error;
    }
  }

  static async getSellerProducts(userId) {
    try {
      const products = await Product.findAll({
        where: { user_id: userId },
      });
      return products;
    } catch (error) {
      console.error("Ошибка получения продуктов продавца:", error);
      throw error;
    }
  }
}

module.exports = ProductService;
