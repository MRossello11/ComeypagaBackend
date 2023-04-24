var express = require('express');
var router = express.Router();
const userController = require('./controllers/userController');

router.route('/rider')
    .get(userController.getRiders)

;

module.exports = router