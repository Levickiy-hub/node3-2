const express = require('express');
const { getAllUsers, addUserForm, getPage, addUserJson } = require('../controllers/index');

module.exports = ()=> {
    const router = express.Router();

    router.get('/', getAllUsers);
    router.get('/index', getPage);
    router.post('/addUser', addUserForm);
    router.post('/addUserJson', addUserJson);

    return router;
}
