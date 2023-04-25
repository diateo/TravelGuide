const User = require('../models/user');

module.exports.registerForm=(req, res) => {
    res.render('users/register');
}

module.exports.register=(async (req, res,next) => {
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
   
})

module.exports.loginForm=(req, res) => {
    res.render('users/login');
}

module.exports.login=(req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectURL = res.locals.returnTo || '/attractions';
    res.redirect(redirectURL);
}

module.exports.logout=(req, res,next) => {
    req.logout(err=>{
        if (err) return next(err);
        req.flash('success', 'See you next time :)');
        res.redirect('/attractions');
    })
}