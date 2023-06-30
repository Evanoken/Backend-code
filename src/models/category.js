const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
});

module.exports = Category;
