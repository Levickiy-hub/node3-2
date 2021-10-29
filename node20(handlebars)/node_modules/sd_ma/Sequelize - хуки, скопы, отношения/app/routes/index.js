const express = require('express');
const { getAllUsers, addUserTransaction, getUsersScope, addRecord } = require('../controllers/index');

module.exports = ()=> {
    const router = express.Router();

    router.get('/', getAllUsers);
    router.get('/scope', getUsersScope);
    router.post('/trans', addUserTransaction);
    router.get('/references', addRecord);

    return router;
}
