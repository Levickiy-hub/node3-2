const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

const sequelize = new Sequelize('Exam', 'root', '12345', {
    dialect: 'mysql',
    host: 'localhost',
    port: '3307',
    logging: false
});

module.exports = {
    users: require('../models/index')(Sequelize,sequelize),

    QueryTypes,
    sequelize,
    Sequelize,
}
