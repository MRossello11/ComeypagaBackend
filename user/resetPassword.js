const express = require('express');
const router = express.Router();
const resetPasswordController = require('./controllers/resetPasswordController');

router.put('/', resetPasswordController.handleResetPassword);

module.exports = router;