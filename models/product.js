const { Sequelize, DataTypes } = require('sequelize');

const db = require('../connexion');

const Product = db.define('product', {

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    devise: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photos: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true
    },
    rates: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    avis: {
        type: DataTypes.JSON,
        allowNull: true
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_promotion :{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

Product.sync().then(() => {
  console.log('table product created');
});
module.exports = Product;