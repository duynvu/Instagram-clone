var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;


var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vuduy',  
  database : 'insta_clone'
});

router.get("/",	function(req,res) {
	if(req.user) {
		var q = "SELECT photos.id as id, image_url, caption, username, avatar FROM photos JOIN follows ON photos.user_id = follows.followee_id JOIN users ON follows.followee_id = users.id WHERE follows.follower_id = ? ORDER BY photos.created_at DESC";
		connection.query(q,[req.user.id], function(err, results) {
			if (err) throw err;
			else res.render("index", {data: results});
		})
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

router.get("/home",isLoggedIn, function(req, res) {
	var newdata = new Object();
	connection.query("SELECT username, image_url FROM users JOIN photos ON users.id = photos.user_id WHERE users.id = ?", [req.user.id], function(err, results) {
		if (err) throw err;
		else res.render("home", {data: results});
	})
})

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