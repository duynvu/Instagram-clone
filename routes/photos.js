var express = require("express");
var router = express.Router();
var passport = require("passport");
var bodyParser = require("body-parser"); // parser request, eg: req.body, req.params.username
var methodOverride = require("method-override"); // lib to write for REST


var mysql = require("mysql");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vuduy',
  password : 'password',
  database : 'insta_clone'
});
// Show new photos page
router.get("/new", function(req, res) {
  res.render("photos/new");
})

// Add new photos
router.post("/", function(req, res) {
  var image_url = req.body.image_url;
  var caption = req.body.caption;
  var tags = caption.split(" ").filter(word => word[0] == "#");
  
  // var q="INSERT INTO photos(image_url, caption, user_id) VALUES (?,?,?)";
  // connection.query(q,[image_url, caption, req.user.id], function(err, results){
  //   if (err) throw err;
  //   // console.log(results);
  //   res.redirect("/");
  // })

  async function getquery() {
    var conn = require('../database/database');
    var q="INSERT INTO photos(image_url, caption, user_id) VALUES (?,?,?)";

    async function insertTags() {
      var check = await conn.query("select * from tags");
      var already_tags = [];
      check.forEach(obj => {
          already_tags.push(obj.tag_name);
      })
      await tags.forEach(word => {
          try {
            if (already_tags.indexOf(word) == -1) {
              conn.query("insert into tags(tag_name) VALUES(?)", word);
            }
          } catch(e) {console.log(e)}
      })
      await tags.forEach(word=> {
          console.log(word);
          console.log(conn.query("SELECT id FROM photos ORDER BY created_at DESC LIMIT 1"));
          conn.query("insert into photo_tags(photo_id, tag_id) VALUES((SELECT id FROM photos order by created_at DESC LIMIT 1),(SELECT id FROM tags WHERE tag_name=?))",[word]);
      })
    }
        await conn.query(q,[image_url, caption, req.user.id]);

    await insertTags();
    res.redirect("/");
  }
  getquery();
  });

// Get a specific photos
router.get("/:pid", function(req,res) {
  async function getquery() {
    var conn = require('../database/database')
    var q1="SELECT photos.id, image_url, DATE_FORMAT(photos.created_at,'%M %d %Y') as created_at, IFNULL(caption,'') as caption, username, avatar as avatarUser FROM photos INNER JOIN users ON photos.user_id = users.id WHERE photos.id = ?";
    var q2="SELECT comments.id, users.username, comments.created_at, comments.comment_text FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.photo_id = (SELECT photos.id FROM photos WHERE photos.id = ?);"
    var q3="SELECT COUNT(*) as nolike FROM likes WHERE photo_id = ?";
    var q4="SELECT * FROM likes WHERE user_id=? AND photo_id=?";
    
    var photoInfo, commentsInfo, likeInfo, checkLiked;

    photoInfo = await conn.query(q1, req.params.pid);
    commentsInfo = await conn.query(q2, req.params.pid);
    likeInfo = await conn.query(q3,req.params.pid);
    checkLiked = await conn.query(q4, [req.user.id, req.params.pid]);
    res.render("photos/index", {photo:photoInfo[0], comments:commentsInfo, likes:likeInfo[0] ,checkLiked: checkLiked[0]});
  }
  getquery();
})

// EDIT ROUTE
// show edit page
router.get("/:pid/edit", function(req, res) {
  var q="SELECT id, image_url, caption FROM photos WHERE photos.id = ?";
  connection.query(q, [req.params.pid], function(err, results) {
      if(err) throw err;
      console.log(results);
      res.render("photos/edit", {photo: results[0]});
  })
})

// update photos
router.put("/:pid", function(req,res) {
  var q="UPDATE photos SET caption = ? WHERE photos.id = ?";
  connection.query(q, [req.body.caption, req.params.pid], function(err, results){
    if(err) throw err;
    console.log(results);
    res.redirect("/photos/"+ req.params.pid);
  })
})

// DELETE PHOTOS
router.delete("/:pid", function(req,res) {
  var q="DELETE FROM photos WHERE photos.id = ?";
  connection.query(q, [req.params.pid], function(err, results) {
      if(err) throw err;
      console.log("DELETE");
      console.log(results);
      res.redirect("/users/"+req.user.username);
  })
})


module.exports = router;