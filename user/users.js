var express = require('express');
var router = express.Router();
const userController = require('./controllers/userController');
const verifyRoles = require('../config/verifyRoles');
const roles = require('../config/roles');

router.route('/rider')
    .get(verifyRoles(roles.ADMIN), userController.getRiders)
    .post(verifyRoles(roles.ADMIN), userController.postRider)
;

router.route('/rider/:id')
    .delete(verifyRoles(roles.ADMIN), userController.deleteRider)
;

module.exports = router