var express     = require('express'), 
    app         = express(),
    request     = require('request'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds"),
    passport    = require("passport"),
    methodOverride = require('method-override'),
    flash       = require('connect-flash'),
    Comment     = require('./models/comment'),
    User        = require('./models/user'),
    localStrategy = require('passport-local');

//Requiring routes:
var commentRoutes = require('./routes/comments'),
 campgroundRoutes = require("./routes/campgrounds"),
 indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
    
//Schema Setup:

// Campground.create({name:'Granite Hill', 
//                 image: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/hostedimages/1473700610i/20504067.jpg', 
//                 description: 'With the arrival of spring and fine weather outside, the good-natured Mole loses patience with spring cleaning. He flees his underground home, emerging to take in the air and ends up at the river, which he has never seen before.'}, 
//                 function(err, campground) {
//                     if(err) {
//                         console.log('Error: ' + err);
//                     }
//                     else {
//                         console.log(campground)
//                     }
//             });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

app.set('view engine', 'ejs');
// seedDB();

app.use(require("express-session")({
    secret:'This is a totally random sentence',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Connected. Listening on port number: ' + process.env.PORT)
});