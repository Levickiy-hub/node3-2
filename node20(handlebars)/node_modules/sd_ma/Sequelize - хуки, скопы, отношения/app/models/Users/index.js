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
        hooks:{
            afterCreate: (attributes, options) => { console.log(`AfterCreate hook`);},
            beforeCreate: (attributes, options) => { console.log(`BeforeCreate hook`);},
        },
        scopes: {
            largeScore: {
                where: {
                    userScore: {[Sequelize.Op.gt]: 6000}
                }
            }
        },
        sequelize,
        tableName: 'Users',
        timestamps: false,
    });
}
