var express = require('express');
var router = express.Router();
const userOrderController = require('./controller/userOrderController')
const riderOrderController = require('./controller/riderOrderController')
const verifyRoles = require('../config/verifyRoles');
const roles = require('../config/roles');

router.route('/')
    .get(verifyRoles(roles.RIDER), riderOrderController.getOrders)
;
router.route('/user')
    .get(verifyRoles(roles.USER), userOrderController.getOrdersUser)
    .put(verifyRoles(roles.USER), userOrderController.putOrder)
    .post(verifyRoles(roles.USER), userOrderController.postOrderPlates)
    .delete(verifyRoles(roles.USER), userOrderController.deleteOrder)
;

router.route('/rider')
    .get(verifyRoles(roles.RIDER), riderOrderController.getOrdersRider)
    .post(verifyRoles(roles.RIDER), riderOrderController.postOrderState)
;

module.exports = router