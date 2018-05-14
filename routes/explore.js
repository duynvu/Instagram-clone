var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vuduy',
  password : 'password',
  database : 'insta_clone'
});

router.get("/", function(req, res) {
  var q = "SELECT * FROM photos ORDER BY created_at";
  connection.query(q, function(err, results) {
    if(err) throw err;
    console.log(results);
    res.render("explore/index", {data: results});
  })
})

// SEARCH for tags
router.post("/tags", function(req, res) {
  res.redirect("/explore/tags/"+req.body.tag);
})

// Get tags
router.get("/tags/:tagname", function(req, res) {
  var tag = "#".concat(req.params.tagname);
  var q = "SELECT id, image_url, user_id FROM photos inner join photo_tags WHERE (photos.id = photo_tags.photo_id) and (tag_id= (SELECT id FROM tags WHERE tag_name=?))";
  connection.query(q, tag,function(err, results) {
    if(err) throw err;
    console.log(results);
    res.render("explore/tags", {data: results, tags:{name: tag}});
  })
})

module.exports = router;

