const User = require('../db/index').users;

async function getAllUsers(req, res) {
    const users = await User.findAll();
    if (!users.length) {
        return res.status(404).send('No data');
    }
    res.end(JSON.stringify(users));
}

async function getUserById(req, res) {
    const params = req.query.id;
    const users = await User.findByPk(params);
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

async function getPageNumber(req, res) {
    const users = await User.findAndCountAll({ limit: 2, offset: 1 });
    if (!users) {
        return res.status(404).send('No data');
    }
    const result = {
        rows: users.rows,
        count: users.count,
    }
    res.end(JSON.stringify(result));
}

async function getUsersOrder(req, res) {
    const users = await User.findAll({ order: [
            ['id', 'DESC'],
        ], });
    if (!users) {
        return res.status(404).send('No data');
    }
    res.end(JSON.stringify(users));
}

async function getUsersGroup(req, res) {
    const users = await User.findAll({  group: 'userSurname' });
    if (!users) {
        return res.status(404).send('No data');
    }
    res.end(JSON.stringify(users));
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByName,
    getPageNumber,
    getUsersOrder,
    getUsersGroup,
}
