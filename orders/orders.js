var express = require('express');
var router = express.Router();
const userOrderController = require('./controller/userOrderController')
const riderOrderController = require('./controller/riderOrderController')

router.route('/')
    .get(riderOrderController.getOrders)
;
router.route('/user')
    .get(userOrderController.getOrdersUser)
    .put(userOrderController.putOrder)
    .post(userOrderController.postOrderPlates)
    .delete(userOrderController.deleteOrder)
;

router.route('/rider')
    .get(riderOrderController.getOrdersRider)
    .post(riderOrderController.postOrderState)
;

module.exports = router