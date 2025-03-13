const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Product.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      article: DataTypes.STRING,
      image: DataTypes.STRING,
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
