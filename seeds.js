var mongoose    = require('mongoose'),
    Campground  = require("./models/campground"),
    Comment     = require('./models/comment');
    
var data = [{
        name:"Cloud's Rest",
        image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/hostedimages/1473700610i/20504067.jpg",
        description: 'Bacon ipsum dolor amet ground round ball tip meatloaf doner, pork belly landjaeger corned beef shoulder venison. Brisket turkey meatloaf, flank pork rump pork belly frankfurter. Venison picanha leberkas frankfurter pork belly, pork chop shank. Ground round corned beef cupim pork shoulder jerky venison tongue beef ribs ribeye doner ball tip pork chop. Tri-tip fatback turkey corned'
    },
    {
        name:"Willow Creek",
        image: "https://www.aconsciousrethink.com/wp-content/uploads/2016/04/wind-in-willows.jpg",
        description: 'Bacon ipsum dolor amet ground round ball tip meatloaf doner, pork belly landjaeger corned beef shoulder venison. Brisket turkey meatloaf, flank pork rump pork belly frankfurter. Venison picanha leberkas frankfurter pork belly, pork chop shank. Ground round corned beef cupim pork shoulder jerky venison tongue beef ribs ribeye doner ball tip pork chop. Tri-tip fatback turkey corned'
    },
    {
        name:"Granite Hill",
        image: "https://uploads6.wikiart.org/images/pierre-auguste-renoir/village-by-the-sea-1889.jpg",
        description: 'Bacon ipsum dolor amet ground round ball tip meatloaf doner, pork belly landjaeger corned beef shoulder venison. Brisket turkey meatloaf, flank pork rump pork belly frankfurter. Venison picanha leberkas frankfurter pork belly, pork chop shank. Ground round corned beef cupim pork shoulder jerky venison tongue beef ribs ribeye doner ball tip pork chop. Tri-tip fatback turkey corned'
    }
];

function seedDB() {
    removeAll(function() {
    //   addCampgrounds(); 
    });
}

function removeAll(callback) {
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        else {
            console.log('Removal success')
            callback();
        }
    });
}

function addCampgrounds() {
    data.forEach(function(seed) {
        Campground.create(seed, function(err, campground){
            if(err){
                console.log(err);
            }
            else {
                console.log('Campground created');
                Comment.create( {
                    text: 'This place is great',
                    author: 'Leon'
                }, function(err, comment) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log('added comment');
                        campground.comments.push(comment);
                        campground.save();
                    }
                    
                });
            }
        });
    });
}

module.exports = seedDB;