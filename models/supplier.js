const { Sequelize, DataTypes } = require('sequelize');

const db = require('../connexion');

const Supplier = db.define('supplier', {

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
    company_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    company_photo: {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    nif: {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    stat: {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    rcs: {
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
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
});

Supplier.sync().then(() => {
  console.log('table supplier created');
});
module.exports = Supplier;
