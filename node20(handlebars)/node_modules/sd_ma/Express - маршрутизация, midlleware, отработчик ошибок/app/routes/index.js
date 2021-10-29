const express = require('express');
const { Validate, addUserSchema, updateUserSchema } = require('../middleware/Validation');
const { getAllUsers, addUser, updateUser, deleteUser } = require('../controllers/index');

module.exports = ()=> {
    const router = express.Router();

    router.get('/', getAllUsers);
    router.post('/', Validate(addUserSchema), addUser);
    router.put('/', Validate(updateUserSchema), updateUser);
    router.delete('/', deleteUser);

    return router;
}
