var express = require('express');
var router = express.Router();
const restaurantController = require('./controller/restaurantController');

router.route('/')
    // restaurant list
    .get(restaurantController.getRestaurants)
    .post(restaurantController.postRestaurant)
    .put(restaurantController.putRestaurant)
;

module.exports = router;
