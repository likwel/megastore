const { Sequelize, DataTypes } = require('sequelize');

const db = require('../connexion');

const Supplier = require('../models/supplier');
const Reviews = require('../models/reviews');

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
    last_price: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    devise: {
        type: DataTypes.STRING,
        allowNull: true
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    featured_image :{
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
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    review_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_promotion :{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    is_sponsored :{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    is_suggested :{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});


Supplier.hasMany(Product, {foreignKey: 'supplier_id'})
Product.belongsTo(Supplier, {foreignKey: 'supplier_id'})

Reviews.hasMany(Product, {foreignKey: 'review_id'})
Product.belongsTo(Reviews, {foreignKey: 'review_id'})

Product.sync().then(() => {
  console.log('table product created');
});
module.exports = Product;
