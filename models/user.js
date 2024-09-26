'use strict';
const { Model } = require('sequelize');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    // Method to generate JWT token
    generateToken() {
      const { id, email, role } = this;
      const token = sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return token;
    }

    // Method to verify password
    verify(password) {
      return compareSync(password, this.password);
    }

  }
  User.init({
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });


  // Hash password before creating a user
  User.beforeCreate((user) => {
      const salt = genSaltSync(10);
      user.password = hashSync(user.password, salt);
  });

  return User;
};