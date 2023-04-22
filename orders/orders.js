var express = require('express');
var router = express.Router();
const orderController = require('./controller/orderController')

router.route('/user')
    .get(orderController.getOrdersUser)
    // .put()
    // .post()
    // .delete()
;

router.route('/rider')
    .get(orderController.getOrdersRider)
    // .post()
;

module.exports = router