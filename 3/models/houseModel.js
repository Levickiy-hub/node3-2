
module.exports = (Sequelize, sequelize) =>{
    return sequelize.define('houses',{
        Id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
        address: {type: Sequelize.STRING, allowNull: false},
        id_owner: { type: Sequelize.INTEGER, allowNull: false },
        Price: { type: Sequelize.INTEGER, allowNull: false },
        busy: { type: Sequelize.INTEGER, allowNull: false },
        info: { type: Sequelize.STRING, allowNull: false }
    },{
        sequelize,
        tableName: 'house',
        timestamps: false
    });
}
