var express     = require('express'), 
    router      = express.Router(),
    passport    = require('passport'),
    User        = require('../models/user');

//Root route:
router.get('/', function(req, res) {
    res.render('landing');
});

//Register form route:
router.get('/register', function(req,res) {
    res.render('register');
});

//Register logic:
router.post('/register', function(req,res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            req.flash('error', 'Error: ' + err.message);
            return res.redirect('register');
        }
        passport.authenticate('local')(req, res, function() {
            req.flash('success', 'Welcome to YelpCamp ' + user.username + '!');
            res.redirect('/campgrounds');
        });
    });
});

//Login form route:
router.get('/login', function(req, res) {
    res.render('login');
});

//Log in logic:
router.post('/login', passport.authenticate('local', {
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}), function(req, res) {
    
});
//Log out route:
router.get('/logout', function(req, res) {
   req.logout();
   req.flash('error', 'Logged out');
   res.redirect('/campgrounds');
});

module.exports = router;