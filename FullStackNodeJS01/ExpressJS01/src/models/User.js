const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING(100), allowNull: false },
    role: { type: DataTypes.ENUM("USER", "ADMIN"), defaultValue: "USER" },
    resetToken: { type: DataTypes.STRING(100), allowNull: true },
    resetTokenExp: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
