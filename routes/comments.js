var express = require("express");
var router = express.Router({mergeParams: true});
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var methodOverride = require("method-override"); // lib to write for REST


var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vuduy', 
  password : 'password', 
  database : 'insta_clone'
});

// ADD NEW COMMENT
router.post("/", function(req,res) {
  var q="INSERT INTO comments(comment_text, photo_id, user_id) VALUES (?,?,?)";

  connection.query(q, [req.body.comment_text, req.params.pid, req.user.id], function(err, results) {
    if(err) throw err;
    console.log(results);
    res.redirect("/photos/"+req.params.pid);
  })
})

// GET edit page
router.get("/:cid/edit", function(req, res) {
  var q="SELECT * FROM comments WHERE id = ?";
  console.log(req.params);
  connection.query(q,[req.params.cid], function(err, results) {
    if(err) throw err;
    console.log(results);
    res.render("comments/edit", {comment:results[0]});
  })
})

// UPDATE comments
router.put("/:cid", function(req, res) {
  var q="UPDATE comments SET comment_text = ? WHERE id = ?";
  connection.query(q, [req.body.comment_text, req.params.cid], function(err, results) {
    if(err) throw err;
    console.log(results);
    res.redirect("/photos/"+req.params.pid);
  })
})

// DELETE comments
router.delete("/:cid", function(req, res) {
  var q="DELETE FROM comments WHERE id = ?";
  connection.query(q, [req.params.cid], function(err, results) {
    if(err) throw err;
    console.log(results);
    res.redirect("/photos/"+req.params.pid);
  })
})

module.exports = router;