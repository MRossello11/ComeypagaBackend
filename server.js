const express = require('express');
const app = express();
const port = 3000;
const session = require("express-session");
const dbConnection = require('./config/dbConnection');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const constants = require('./config/constants');

dbConnection();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: constants.loggedCookieSecret,
    resave: false,
    saveUnitialized: false
  })
);

app.use(
  session({
    secret: constants.userRoleCookieSecret,
    resave: false,
    saveUnitialized: false
  })
);

// users
app.use('/user/login', require('./user/login'));
app.use('/user/registry', require('./user/registry'));
app.use('/user/resetPassword', require('./user/resetPassword'));
app.use('/user', require('./user/users'));

// restaurants
app.use('/restaurants', require('./restaurants/restaurants'));

// orders
app.use('/orders', require('./orders/orders'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
});