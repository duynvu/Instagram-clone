var express = require("express");
var router = express.Router({mergeParams: true});
var bodyParser = require("body-parser");
var methodOverride = require("method-override"); // lib to write for REST

var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vuduy',  
  database : 'insta_clone'
});

// add a follow
router.post("/", function(req,res) {
  // 	async function getquery() {
  //   var conn = require('../database/database');
  //   var q1="SELECT id FROM users WHERE username = ?";
  //   var q2="INSERT INTO follows (follower_id, followee_id) VALUES (?,?)";
  //   var user, nofollower, nofollowee;
    
  //   user = await conn.query(q1, req.params.username);
  //       console.log(user);
  //   var id = user[0].id;
  //   console.log(id);

  //   // nofollower = await conn.query(q2, req.user.id, id);

  //   console.log(nofollower);
  //   res.redirect("/users/"+req.params.username);
  // 	}
  // 	getquery();
  var q="INSERT INTO follows (follower_id, followee_id) VALUES (?,(SELECT id FROM users WHERE username= ?))";
  connection.query(q, [req.user.id, req.params.username], function(err, results) {
    if(err) console.log(err);
    console.log(results);
    res.redirect("/users/"+req.params.username);
  })
})

// delete a like
router.delete("/", function(req, res) {
  var q="DELETE FROM follows WHERE follower_id=? AND followee_id = (SELECT id FROM users WHERE username= ?)";
  connection.query(q, [req.user.id, req.params.username], function(err, results) {
    if(err) console.log(err);
    console.log(results);
    res.redirect("/users/"+req.params.username);
  })
})

module.exports = router;