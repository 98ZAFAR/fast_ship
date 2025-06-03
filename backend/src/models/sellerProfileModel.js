const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/dbConfig");

const SellerProfile = sequelize.define(
  "SellerProfile",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    businessDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    businessLicenseNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessWebsite: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports = SellerProfile;