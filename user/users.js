var express = require('express');
var router = express.Router();
const userController = require('./controllers/userController');

router.route('/rider')
    .get(userController.getRiders)
    .post(userController.postRider)

;

module.exports = router