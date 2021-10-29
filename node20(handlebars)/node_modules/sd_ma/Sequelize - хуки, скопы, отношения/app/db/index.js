const Sequelize = require('sequelize');

const sequelize = new Sequelize('Exam', 'root', '12345', {
    dialect: 'mysql',
    host: 'localhost',
    port: '3307',
    logging: false
});


module.exports = {
    users: require('../models/Users/index')(Sequelize, sequelize),
    recording: require('../models/Recording/index')(Sequelize, sequelize),

    sequelize,
    Sequelize,
}
