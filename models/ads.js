const { Sequelize, DataTypes } = require('sequelize');

const db = require('../connexion');


const Reviews = db.define('ads', {

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dead_of_day: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    
});


Reviews.sync().then(() => {
  console.log('table ads created');
});
module.exports = Reviews;
