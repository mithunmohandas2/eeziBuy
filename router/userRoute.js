const express = require("express");
const user_route = express();


const session = require('express-session'); //session
const config = require('../config/config')

user_route.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}))

const auth = require("../middleware/auth");


user_route.set('view engine', 'ejs');
user_route.set('views', './views/users')

const bodyParser = require("body-parser");
user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({ extended: true }))

const userController = require("../controllers/userController");

//root page
user_route.get('/', auth.isLogout, userController.loginLoad);

//signup
user_route.get('/register', auth.isLogout, userController.loadRegister);
user_route.post('/register', userController.insertUser);

//login
user_route.get('/login', auth.isLogout, userController.loginLoad);
user_route.post('/login', userController.verifyLogin);

user_route.get('/home', auth.isLogin, userController.loadHome);

//logout
user_route.post('/logout', userController.logout);
user_route.get('/logout', auth.isLogout, userController.loginLoad);


module.exports = user_route;