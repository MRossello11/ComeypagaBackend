var express = require('express');
var router = express.Router();
const restaurantController = require('./controller/restaurantController');
const menuController = require('./controller/menuController');
const verifyRoles = require('../config/verifyRoles');
const roles = require('../config/roles');

router.route('/')
    // restaurant list
    .get(restaurantController.getRestaurants)
    .post(verifyRoles(roles.Admin), restaurantController.postRestaurant)
    .put(verifyRoles(roles.Admin), restaurantController.putRestaurant)
    .delete(verifyRoles(roles.Admin), restaurantController.deleteRestaurant)
;

router.route('/menu')
    .put(verifyRoles(roles.Admin), menuController.putPlate)
    .post(verifyRoles(roles.Admin), menuController.postPlate)
    .delete(verifyRoles(roles.Admin), menuController.deletePlate)
;

module.exports = router;
