var express = require("express");
var router = express.Router({mergeParams: true});
var bodyParser = require("body-parser");
var methodOverride = require("method-override"); // lib to write for REST

var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vuduy',
  password : 'password',
  database : 'insta_clone'
});

// add a like
router.post("/", function(req,res) {
  console.log("in like router");
  var q="INSERT INTO likes (user_id, photo_id) VALUES (?,?)";
  connection.query(q, [req.user.id, req.params.pid], function(err, results) {
    if(err) console.log(err);
    console.log(results);
    res.redirect("/photos/"+req.params.pid);
  })
})

// delete a like
router.delete("/", function(req, res) {
  var q="DELETE FROM likes WHERE user_id=? AND photo_id=?";
  connection.query(q, [req.user.id, req.params.pid], function(err, results) {
    if(err) console.log(err);
    console.log(results);
    res.redirect("/photos/"+req.params.pid);
  })
})

module.exports = router;