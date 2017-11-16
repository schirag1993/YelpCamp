var express     = require('express'), 
    router      = express.Router(),
    Comment     = require('../models/comment'),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");

//Index route:
router.get('/', function(req,res) {
    Campground.find(function(err, allCampgrounds) {
        if(err) {
            console.log('Error: ' + err)
        }
        else {
            res.render('campgrounds/index', {campgrounds:allCampgrounds});
        }
    });
    // res.render('campGrounds', {campgrounds:campGrounds});
});

//The new section needs to be declared first. Otherwise the order will ensure that the 'campgrounds/:id' route will trigger for 'campgrounds/new'
//Create new campground route:
router.get('/new', middleware.isLoggedIn, function(req,res) {
    res.render('campgrounds/new');
});

router.get('/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if(err) {
            console.log('Error: ' + err);
        }
        else {
            // console.log('Campground is ' + foundCampground);
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
    });

//Create new campground logic:
router.post('/', middleware.isLoggedIn, function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name:name, image:image, description: description, author:author, price:price};
    // console.log('User data: ' + req.user)
    Campground.create(newCampground, function(err, newlyCreatedCampground) {
        if(err) {
            console.log('Error: ' + err);
        }
        else {
            console.log('Created = ' + newlyCreatedCampground);
        }
    });
    res.redirect('/campgrounds');
});

//Edit campgrounds
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
            res.render('campgrounds/edit', {campground: foundCampground});
        });
});

//update campgrounds
router.put('/:id', middleware.checkCampgroundOwnership, function(req,res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            console.log('Error: ' + err);
            res.redirect('/campgrounds');
        }
        else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//destroy campgrounds:
router.delete('/:id', middleware.checkCampgroundOwnership, function(req,res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log('Error: ' + err);
            res.redirect('/campgrounds');
        }
        else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;