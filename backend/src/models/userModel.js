const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/dbConfig");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profileURL: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    role: {
      type: DataTypes.ENUM("customer", "seller", "admin"),
      defaultValue: "customer",
    },
  },
  {
    timestamps: true,
    indexes: [{ fields: ["email"], unique: true }],
  }
);

module.exports = User;
