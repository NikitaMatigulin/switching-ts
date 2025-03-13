const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.User, { foreignKey: "user_id" });
      CartItem.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }

  CartItem.init(
    {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "CartItem",
    }
  );

  return CartItem;
};
