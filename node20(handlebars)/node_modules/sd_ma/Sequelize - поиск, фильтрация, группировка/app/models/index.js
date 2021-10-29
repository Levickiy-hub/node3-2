module.exports = (Sequelize, sequelize) => {
    return sequelize.define('Users', {
        Id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
        userName: {type: Sequelize.STRING, allowNull: false},
        userSurname: {type: Sequelize.STRING, allowNull: false},
        userBirth_date: {type: Sequelize.DATE, allowNull: false},
        userPassword: {type: Sequelize.STRING, allowNull: false},
        userMail: {type: Sequelize.STRING, allowNull: false},
        userScore: {type: Sequelize.STRING, allowNull: true},
    }, {
        sequelize,
        tableName: 'Users',
        timestamps: false,
    });
}
