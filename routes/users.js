const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const { storeReturnTo } = require('../midleware');

router.get('/register', users.registerForm);

router.post('/register', catchAsync(users.register));

router.get('/login', users.loginForm);

router.post('/login',storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), users.login)

router.post('/logout', users.logout)

module.exports = router;