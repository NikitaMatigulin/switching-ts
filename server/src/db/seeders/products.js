const { Product } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Product.bulkCreate([
      {
        title: "Product 1",
        description: "Описание продукта 1",
        price: 10.99,
        article: "ART-001",
        image:
          "https://azaliadecor.ru/upload/iblock/5c7/pya5k5qetqhcd2lm4finiaulj4hjv7pq.jpg",
      },
      {
        title: "Product 2",
        description: "Описание продукта 2",
        price: 9.99,
        article: "ART-002",
        image:
          "https://azaliadecor.ru/upload/iblock/5c7/pya5k5qetqhcd2lm4finiaulj4hjv7pq.jpg",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
