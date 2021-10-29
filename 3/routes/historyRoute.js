const express = require('express');
const historyController = require('../controllers/historyController');

module.exports = ()=> {
    let router = express.Router();

    router.get('/', historyController.getAllHistory);
    router.post('/', historyController.addHistory);
    router.put('/', historyController.editHistory);
    router.delete('/', historyController.deleteHistory);

    return router;


}
