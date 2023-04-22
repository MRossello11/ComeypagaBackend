var express = require('express');
var router = express.Router();
const userOrderController = require('./controller/userOrderController')
const riderOrderController = require('./controller/riderOrderController')

router.route('/user')
    .get(userOrderController.getOrdersUser)
    .put(userOrderController.putOrder)
    // .post()
    // .delete()
;

router.route('/rider')
    .get(riderOrderController.getOrdersRider)
    .post(riderOrderController.postOrderState)
;

module.exports = router