const express = require('express');
const { getAllUsers, addUser, updateUser, deleteUser, rawQuery } = require('../controllers/index');

module.exports = ()=> {
    const router = express.Router();

    router.get('/', getAllUsers);
    router.get('/raw', rawQuery);
    router.post('/', addUser);
    router.put('/', updateUser);
    router.delete('/', deleteUser);

    return router;
}
