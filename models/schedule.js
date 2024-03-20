const { Sequelize, DataTypes } = require('sequelize');

const db = require('../connexion');

const Schedule = db.define('schedule', {

    // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday et Sunday
    monday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    monday_hours: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    tuesday: {
        type: DataTypes.BOOLEAN,
        unique: true,
        allowNull: false
    },
    tuesday_hours: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    wednesday: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    wednesday_hours: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    thursday: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    thursday_hours: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    friday: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    friday_hours: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    saturday: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    saturday_hours: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    sunday: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    sunday_hours: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    
});

Schedule.sync().then(() => {
  console.log('table schedule created');
});
module.exports = Schedule;
