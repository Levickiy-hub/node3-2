const express = require('express');
const { getAllUsers, getUserById, getUserByName, getPageNumber, getUsersOrder, getUsersGroup } = require('../controllers/index');

module.exports = ()=> {
    const router = express.Router();

    router.get('/all', getAllUsers);
    router.get('/:id/:name', getUserById);
    router.get('/name', getUserByName);

    return router;
}
