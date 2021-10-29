const express = require('express');
const { getAllUsers, getUserById, getUserByName, getPageNumber, getUsersOrder, getUsersGroup } = require('../controllers/index');

module.exports = ()=> {
    const router = express.Router();

    router.get('/all', getAllUsers);
    router.get('/id', getUserById);
    router.get('/name', getUserByName);
    router.get('/page', getPageNumber);
    router.get('/order', getUsersOrder);
    router.get('/group', getUsersGroup);

    return router;
}
