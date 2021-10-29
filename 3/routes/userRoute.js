const express = require('express');
const userController = require('../controllers/userController');

module.exports = ()=> {
    let router = express.Router();

    router.get('/', userController.getAllUsers);
    router.post('/', userController.addUsers);
    router.put('/', userController.editUser);
    router.delete('/', userController.deleteUser);

    return router;


}
