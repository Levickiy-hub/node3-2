const express = require('express');
const houseController = require('../controllers/houseController');

module.exports = ()=> {
    let router = express.Router();

    router.get('/', houseController.getAllHouse);
    router.post('/', houseController.addHouse);
    router.put('/', houseController.editHouse);
    router.delete('/', houseController.deleteHouse);

    return router;


}
