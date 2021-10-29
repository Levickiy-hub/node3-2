const Users = require('../Users/index');

module.exports = (Sequelize, sequelize) => {
    return sequelize.define('Recording', {
        Id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
        author: {type: Sequelize.STRING, allowNull: false, references: {model: Users, key: 'Users'}},
        record: {type: Sequelize.STRING, allowNull: true},
    }, {
        sequelize,
        tableName: 'Recording',
        timestamps: false,
    });
}
