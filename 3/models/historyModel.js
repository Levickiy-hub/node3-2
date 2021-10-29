
module.exports = (Sequelize, sequelize)=>{
    return sequelize.define('history', {
        Id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
        Id_client: { type: Sequelize.INTEGER, allowNull: false },
        Check_in: { type: Sequelize.DATE, allowNull: false },
        Eviction: { type: Sequelize.DATE, allowNull: true },
        Id_house: { type: Sequelize.INTEGER, allowNull: false }
    },{
        sequelize,
        tableName: 'history',
        timestamps: false
    })
}
