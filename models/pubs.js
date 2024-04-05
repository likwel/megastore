const { Sequelize, DataTypes } = require('sequelize');

const db = require('../connexion');

const Pubs = db.define('pubs', {

    title : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    featured_image :{
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_active :{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});


Pubs.sync().then(() => {
  console.log('table Pubs created');
});
module.exports = Pubs;
