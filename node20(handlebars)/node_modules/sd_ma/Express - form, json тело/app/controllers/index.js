const User = require('../db/index').users;

async function getAllUsers(req, res) {
    const users = await User.findAll();
    if (!users.length) {
        return res.status(404).send('No data');
    }
    res.end(JSON.stringify(users));
}

async function getPage(req, res) {
    res.sendFile('D:\\University\\3 курс 2 сем\\ПСКП\\Exam\\task_14\\index.html')
}

async function addUserForm(req, res) {
    const { Id, userName, userSurname, userBirth_date, userPassword, userMail, userScore } = req.body;
    const newUser = await User.create({
        Id: Id,
        userName: userName,
        userSurname: userSurname,
        userBirth_date: userBirth_date,
        userPassword: userPassword,
        userMail: userMail,
        userScore: userScore,
    });
    if (!newUser) {
        return res.status(401).send('Body is not correct')
    }
    res.send(`New user was added, full name is ${userName} ${userSurname}`);
}

async function addUserJson(req, res) {
    const { Id, userName, userSurname, userBirth_date, userPassword, userMail, userScore } = req.body;
    const newUser = await User.create({ Id, userName, userSurname, userBirth_date, userPassword, userMail, userScore });
    if (!newUser) {
        return res.status(401).send('Body is not correct')
    }
    res.end(JSON.stringify(newUser));
}

module.exports = {
    getAllUsers,
    addUserForm,
    getPage,
    addUserJson,
}
