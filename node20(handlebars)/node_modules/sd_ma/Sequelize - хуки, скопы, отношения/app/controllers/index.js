const User = require('../db/index').users;
const Recording = require('../db/index').recording;
const ORM = require('../db/index');

User.hasMany(Recording, {as:'user_recording', foreignKey:'Id', sourceKey: 'Id'});

async function getAllUsers(req, res) {
    const users = await User.findAll();
    if (!users.length) {
        return res.status(404).send('No data');
    }
    res.end(JSON.stringify(users));
}

async function getUsersScope(req, res) {
    const users = await User.scope('largeScore').findAll();
    if (!users.length) {
        return res.status(404).send('No data');
    }
    res.end(JSON.stringify(users));
}

async function addUserTransaction(req, res) {
    const { Id, userName, userSurname, userBirth_date, userPassword, userMail, userScore } = req.body;
    const trans = await ORM.sequelize.transaction({isolationLevel: ORM.Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED});
    const newTransactionUser = await User.create({ Id, userName, userSurname, userBirth_date, userPassword, userMail, userScore }, {transaction: trans})
        .then(()=>{
        setTimeout(()=>{
            console.log('Rollback');
            return trans.rollback();
        }, 10000);
    })
    res.end(JSON.stringify(newTransactionUser));
}

async function addRecord(req, res) {
    const id = req.query.id;
    const record = await User.findAll({where:{Id: id}, include:[{model: Recording, as:'user_recording', required: true}]} )
    if (!record.length) {
        return res.status(404).send('No data');
    }
    res.end(JSON.stringify(record));
}



module.exports = {
    getAllUsers,
    addUserTransaction,
    getUsersScope,
    addRecord,
}
