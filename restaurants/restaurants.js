var express = require('express');
var router = express.Router();
const restaurantController = require('./controller/restaurantController');
const menuController = require('./controller/menuController');
const verifyRoles = require('../config/verifyRoles');
const roles = require('../config/roles');

router.route('/')
    // restaurant list
    .get(restaurantController.getRestaurants)
    .post(verifyRoles(roles.ADMIN), restaurantController.postRestaurant)
    .put(verifyRoles(roles.ADMIN), restaurantController.putRestaurant)
    .delete(verifyRoles(roles.ADMIN), restaurantController.deleteRestaurant)
;

router.route('/menu')
    .put(verifyRoles(roles.ADMIN), menuController.putPlate)
    .post(verifyRoles(roles.ADMIN), menuController.postPlate)
    .delete(verifyRoles(roles.ADMIN), menuController.deletePlate)
;

module.exports = router;
