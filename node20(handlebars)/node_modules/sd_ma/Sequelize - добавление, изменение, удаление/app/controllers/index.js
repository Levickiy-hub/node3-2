const User = require('../db/index').users;
const ORM = require('../db/index');

async function getAllUsers(req, res) {
    const users = await User.findAll();
    if (!users.length) {
        return res.status(404).send('No data');
    }
    res.end(JSON.stringify(users));
}

async function addUser(req, res) {
    const { Id, userName, userSurname, userBirth_date, userPassword, userMail, userScore } = req.body;
    const newUser = await User.create({ Id, userName, userSurname, userBirth_date, userPassword, userMail, userScore });
    if (!newUser) {
        return res.status(401).send('Body is not correct')
    }
    res.end(JSON.stringify(newUser));
}

async function updateUser(req, res) {
    const { userName, userSurname, userBirth_date, userPassword, userMail, userScore } = req.body;
    const { id } = req.query;

    const editedUser = await User.update({ userName, userSurname, userBirth_date, userPassword, userMail, userScore }, {where: {Id: id}});
    if (!editedUser) {
        return res.status(401).send('Params are not correct')
    }
    res.end(JSON.stringify(editedUser));
}

async function deleteUser(req, res) {
    const { id } = req.query;
    const deletedUser = await User.destroy({where: {Id: id}});
    if (!deletedUser) {
        return res.status(401).send('Id is not correct')
    }
    res.end(JSON.stringify(deletedUser));
}

async function rawQuery(req, res) {
    const users = await ORM.sequelize.query("SELECT `userName`, `userSurname` FROM `Users`", { type: ORM.QueryTypes.SELECT });
    if (!users) {
        return res.status(401).send('Id is not correct')
    }
    res.end(JSON.stringify(users));
}

module.exports = {
    getAllUsers,
    addUser,
    updateUser,
    deleteUser,
    rawQuery,
}
