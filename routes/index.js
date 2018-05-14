var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;


var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vuduy',
  password : 'password',
  database : 'insta_clone'
});

router.get("/",	function(req,res) {
	async function getquery() {
    	var conn = require('../database/database');
		var q1 = "SELECT photos.id as id, image_url, caption, username, avatar, DATE_FORMAT(photos.created_at, '%M %d %Y %r') as created_at FROM photos JOIN follows ON photos.user_id = follows.followee_id JOIN users ON follows.followee_id = users.id WHERE follows.follower_id = ?";
    	var q2 = "SELECT photos.id as id, image_url, caption, username, avatar, DATE_FORMAT(photos.created_at, '%M %d %Y %r') as created_at FROM photos JOIN users ON photos.user_id = users.id WHERE users.id = ?";
    	var followerPhotos, ownPhotos, results;
    	followerPhotos = await conn.query(q1, req.user.id);
    	ownPhotos = await conn.query(q2, req.user.id);
    	results = await followerPhotos.concat(ownPhotos);
    	await results.sort(function(a,b){
    		if(a.created_at<b.created_at)
    			return 1;
    		else if(a.created_at>b.created_at)
    			return -1;
    		else
    			return 0;
    	});
    	console.log(results);
    	res.render("index", {data: results})
	}

	if(req.user) {
			getquery();
	} else {
		res.render("index");
	}
});

// GET SIGN UP PAGE
router.get("/signup", function(req, res) {
    res.render("signup");
});

// REGISTER A NEW USER
router.post('/signup', passport.authenticate('local-signup', {
	successRedirect : '/', // redirect to the secure profile section
	failureRedirect : '/signup', // redirect back to the signup page if there is an error
// 	failureFlash : true // allow flash messages
}));

// GET LOG IN PAGE
router.get("/login", function(req, res) {
    res.render("login");
})

// VERIFY A USER
router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login' // redirect back to the signup page if there is an error
        // failureFlash : true // allow flash messages
	}),
    function(req, res) {
});

router.get("/logout", function(req,res) {
	req.logout();
	res.redirect("/");
})

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		return next();
	}
	console.log(req.user);
	// if they aren't redirect them to the home page
	res.redirect('/');
}


module.exports = router;