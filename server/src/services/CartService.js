const { CartItems } = require("../db/models");

class CartService {
  static async create(data) {
    try {
      const cartItem = await CartItems.create(data);
      return cartItem;
    } catch (error) {
      console.error("Ошибка создания элемента корзины:", error);
      throw error;
    }
  }

  static async getAll(userId) {
    try {
      const cartItems = await CartItems.findAll({
        where: { user_id: userId },
      });
      return cartItems;
    } catch (error) {
      console.error("Ошибка получения элементов корзины:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const deletedItem = await CartItems.destroy({ where: { id } });
      return deletedItem;
    } catch (error) {
      console.error("Ошибка удаления элемента корзины:", error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const updatedItem = await CartItems.update(data, { where: { id } });
      return updatedItem;
    } catch (error) {
      console.error("Ошибка обновления элемента корзины:", error);
      throw error;
    }
  }
}

module.exports = CartService;
