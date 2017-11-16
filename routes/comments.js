var express     = require('express'), 
    router      = express.Router({mergeParams:true}),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware"),
    Comment     = require('../models/comment');
//Add new comment
router.get('/new', middleware.isLoggedIn, function(req,res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        }
        else {
            res.render('comments/new', {campground:campground});
        }
    });
});

//Create comment
router.post('/', middleware.isLoggedIn, function(req,res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            // console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                    req.flash('error', 'Something went wrong!');
                }
                else {
                    // console.log('user of new comment: ' + req.user.username);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash('success', 'Comment added successfully');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//comment edit:
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req,res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            console.log('Error: ' + err);
            res.redirect('back');
        }
        else {
            res.render('comments/edit', {campground_id:req.params.id, comment:foundComment});
        }
    });
});

//comment update:
router.put('/:comment_id', middleware.checkCommentOwnership, function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    });
});

//comment destroy route:
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            console.log(err);
            res.redirect('back')
        }
        else {
            req.flash('success', 'Comment removed');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

module.exports = router;