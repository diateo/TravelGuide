const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../midleware');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res,next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Congrats!! Welcome to Romania travel guide!');
            res.redirect('/attractions');
        });
    } catch (e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
   
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login',storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectURL = res.locals.returnTo || '/attractions';
    res.redirect(redirectURL);
})

router.post('/logout', (req, res,next) => {
    req.logout(err=>{
        if (err) return next(err);
        req.flash('success', 'See you next time :)');
        res.redirect('/attractions');
    })
})

module.exports = router;