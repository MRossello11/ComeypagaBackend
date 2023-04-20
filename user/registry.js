const express = require('express');
const router = express.Router();
const registryController = require('./controllers/registryController');

router.put('/', registryController.handleRegistry)

module.exports = router;