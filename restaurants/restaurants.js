var express = require('express');
var router = express.Router();
const restaurantController = require('./controller/restaurantController');

router.route('/')
    // restaurant list
    .get(restaurantController.getRestaurants)
    .put(restaurantController.postRestaurant)
;

module.exports = router;
