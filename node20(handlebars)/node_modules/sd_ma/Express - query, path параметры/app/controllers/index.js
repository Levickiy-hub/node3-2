const User = require('../db/index').users;

async function getAllUsers(req, res) {
    const users = await User.findAll();
    if (!users.length) {
        return res.status(404).send('No data');
    }
    res.end(JSON.stringify(users));
}

async function getUserById(req, res) {
    const { id, name } = req.params;
    const users = await User.findOne({where: { Id: id, userName: name }});
    if (!users) {
        return res.status(404).send('No data');
    }
    res.end(JSON.stringify(users));
}

async function getUserByName(req, res) {
    const params = req.query.name;
    const users = await User.findOne({where: { userName: params }});
    if (!users) {
        return res.status(404).send('No data');
    }
    res.end(JSON.stringify(users));
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByName,
}
