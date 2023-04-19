const express = require('express');
const router = express.Router();
const registryController = require('./controllers/registryController');

router.post('/', registryController.handleRegistry)

module.exports = router;