const { Sequelize, DataTypes } = require('sequelize');

const db = require('../connexion');

const Product = require('../models/product');

const Reviews = db.define('reviews', {

    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    avis: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    note: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    
});


// Product.hasMany(Reviews, {foreignKey: 'product_id'})
// Reviews.belongsTo(Product, {foreignKey: 'product_id'})

Reviews.sync().then(() => {
  console.log('table Reviews created');
});
module.exports = Reviews;
