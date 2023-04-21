var express = require('express');
var router = express.Router();
const restaurantController = require('./controller/restaurantController');
const menuController = require('./controller/menuController');

router.route('/')
    // restaurant list
    .get(restaurantController.getRestaurants)
    .post(restaurantController.postRestaurant)
    .put(restaurantController.putRestaurant)
    .delete(restaurantController.deleteRestaurant)
;

router.route('/menu')
    .get(menuController.getMenu)
    .put(menuController.putPlate)
;

module.exports = router;
