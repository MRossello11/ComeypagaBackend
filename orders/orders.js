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
    .post(verifyRoles(roles.USER), userOrderController.postOrder)
;
router.route('/user/:userId')
    .get(verifyRoles(roles.USER), userOrderController.getOrdersUser)
;
router.route('/user/:id')
    .delete(verifyRoles(roles.USER), userOrderController.deleteOrder)
;

router.route('/rider')
    .post(verifyRoles(roles.RIDER), riderOrderController.postOrderState)
;

router.route('/rider/:riderId')
    .get(verifyRoles(roles.RIDER), riderOrderController.getOrdersRider)
;
router.route('/user/historic/:userId')
    .get(verifyRoles(roles.USER), userOrderController.getHistoricOrdersUser)
;
module.exports = router