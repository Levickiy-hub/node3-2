module.exports = (Sequelize, sequelize)=>{
    return sequelize.define('Users', {
        Id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
        Name: {type: Sequelize.STRING, allowNull: false}
    },{
        sequelize,
        tableName: 'client',
        timestamps: false
    });
}
