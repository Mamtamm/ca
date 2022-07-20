"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static basicAttributes(arr = null) {
      let basicAttributesArr = [
        "id",
        "firstName",
        "lastName",
        "email",
        "createdAt",
        "updatedAt",
        "phone",
      ];

      return arr ? basicAttributesArr.concat(arr) : basicAttributesArr;
    }
    static allAttributes(arr = null) {
      let basicAttributesArr = [
        "id",
        "firstName",
        "lastName",
        "email",
        "phone",
        "password",
        "resetHash",
        "createdAt",
        "updatedAt",
      ];

      return arr ? basicAttributesArr.concat(arr) : basicAttributesArr;
    }
  }

  User.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING },
      password: {
        type: DataTypes.STRING,
        set(value) {
          if (value) this.setDataValue("password", bcrypt.hashSync(value, 10));
        },
      },
      resetHash: { type: DataTypes.STRING },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      modelName: "User",
      tableName: "users",
    }
  );

  return User;
};
