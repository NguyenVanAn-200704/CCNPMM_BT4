const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Category = require("./Category");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

module.exports = Product;
