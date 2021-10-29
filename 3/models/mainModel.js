const Sequelize = require('sequelize');
const sequelize = new Sequelize('rent', 'root', '12345', {
    dialect: 'mysql',
    host: 'localhost',
    port: '3306',
    logging: false
});

module.exports = {
    users: require('./userModel')(Sequelize, sequelize),
    houses: require('./houseModel')(Sequelize, sequelize),
   histories: require('./historyModel')(Sequelize, sequelize),

    sequelize,
    Sequelize,
};
