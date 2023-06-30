const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Supplier = sequelize.define('Supplier', {
  supplier_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
});

module.exports = Supplier;
