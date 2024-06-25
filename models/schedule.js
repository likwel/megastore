const { Sequelize, DataTypes } = require('sequelize');

const db = require('../connexion');

const Schedule = db.define('schedule', {

    // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday et Sunday
    id_vendor :{
        type: DataTypes.INTEGER,
        allowNull: true,
    }
    monday: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    monday_hours: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    tuesday: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    tuesday_hours: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    wednesday: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    wednesday_hours: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    thursday: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    thursday_hours: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    friday: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    friday_hours: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    saturday: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    saturday_hours: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    sunday: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    sunday_hours: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    
});

Schedule.sync().then(() => {
  console.log('table schedule created');
});
module.exports = Schedule;
