var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vuduy',  
  database : 'insta_clone'
});

router.get("/", function(req, res) {
    res.redirect("/");
})

//show specific username page 
router.get("/:username", function(req,res) {
	async function getquery() {
    var conn = require('../database/database');
    var q1="SELECT * FROM users JOIN photos ON users.id = photos.user_id WHERE users.username = ?";
    var q2="SELECT COUNT(*) as nofollower FROM follows WHERE follower_id = (SELECT id FROM users WHERE username= ?)";
    var q3="SELECT COUNT(*) as nofollowee FROM follows WHERE followee_id = (SELECT id FROM users WHERE username= ?)";
    var q4="SELECT * FROM follows WHERE follower_id = ? AND followee_id = (SELECT id FROM users WHERE username= ?)";
    var photos, nofollower, nofollowee, checkFollowed;
    
    photos = await conn.query(q1, req.params.username);
    nofollower = await conn.query(q2, req.params.username);
    nofollowee = await conn.query(q3, req.params.username);
    if(req.user) {
      checkFollowed = await conn.query(q4, [req.user.id, req.params.username]);
    } else {
      checkFollowed = [];
    }
    // console.log(user);
    // console.log(nofollowee[0]);
    // console.log(nofollower[0]);
    res.render("users/index", {data: photos, nofollower: nofollower[0], nofollowee: nofollowee[0], checkFollowed: checkFollowed[0]});

    // photoInfo = await conn.query(q1, req.params.pid);
    // commentsInfo = await conn.query(q2, req.params.pid);
    // likeInfo = await conn.query(q3, [req.user.id, req.params.pid]);
    // console.log(likeInfo);
    // res.render("", {});
  }
  getquery();
	// if(req.params.username == req.user.username) {
	// 		connection.query("SELECT * FROM users JOIN photos ON users.id = photos.user_id WHERE users.username = ?", [req.params.username], function(err, results) {
	// 	if (err) throw err;
	// 	else res.render("users/index", {data: results});
	// })

	// connection.query("SELECT * FROM users JOIN photos ON users.id = photos.user_id WHERE users.username = ?", [req.params.username], function(err, results) {
	// 	if (err) throw err;
	// 	else res.render("users/index", {data: results});
	// })
})

// show EDIT FORM
router.get("/:username/edit", function(req, res) {
	res.render("users/edit");
})

// UPDATE USER
router.put("/:username", function(req, res) {
	var q = "UPDATE users SET password = ?, avatar=? WHERE username = ?";
	// console.log("In put users");
	console.log("req.body.username, req.body.password, req.body.avatar ,req.user.username");
	connection.query(q,[req.body.password, req.body.avatar ,req.user.username], function(err, results) {
		if(err) throw err;
		console.log(results);// need to check again
	});
	res.redirect("/");
})

// DELETE USER - should i???


module.exports = router;