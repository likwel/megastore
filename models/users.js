const { Sequelize, DataTypes } = require('sequelize');

const db = require('../connexion');

// const Supplier = require('../models/supplier');

const User = db.define('user', {

    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        isEmail: true, //checks for email format
        allowNull: false
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    types: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ville: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    roles: {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

User.sync().then(() => {
  console.log('table user created');
});
module.exports = User;
