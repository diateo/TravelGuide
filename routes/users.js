const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const { storeReturnTo } = require('../midleware');

router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.loginForm)
    .post(storeReturnTo, passport.authenticate
        ('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.post('/logout', users.logout)

module.exports = router;