const { User } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await User.bulkCreate([
      {
        name: "Никита",
        email: "123@mail.ru",
        password: "Password1!",
        role: 1,
      },
      {
        name: "Вава",
        email: "2@mail.ru",
        password: "Password1!",
        role: 2,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
