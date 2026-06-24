const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
});

Product.belongsTo(Category, { foreignKey: 'CategoryId' });
Category.hasMany(Product, { foreignKey: 'CategoryId' });

module.exports = Product;