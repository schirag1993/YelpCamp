// all middleware goes here
var Comment     = require('../models/comment'),
    Campground  = require("../models/campground");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                console.log('Error: ' + err);
                req.flash('error', 'Something went wrong' + err);
                res.redirect('back');
            }
            else {
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash('error', 'Insufficient permissions');
                    res.redirect('back');
                }
            }
        });
    }
    else {
        req.flash('error', 'You need to be logged in')
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                req.flash('error', 'Error: ' + err);
                console.log('Error: ' + err);
                res.redirect('back');
            }
            else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash('error', 'Insufficient permissions');
                    res.redirect('back');
                }
            }
        });
    }
    else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in');
    res.redirect('/login');
}

module.exports = middlewareObj;