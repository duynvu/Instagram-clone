var express = require("express");
var app = express();
var bodyParser = require("body-parser"); // parser request, eg: req.body, req.params.username
var methodOverride = require("method-override"); // lib to write for REST
var passport = require("passport"); //lib to authentication/authorization
var LocalStrategy = require("passport-local").Strategy;
var flash = require("connect-flash");

// Routes
var indexRouter = require("./routes/index");
var userRouter = require("./routes/users");
var photoRouter = require("./routes/photos");
var commentRouter = require("./routes/comments");
var likeRouter = require("./routes/likes");
var followRouter = require("./routes/follows");
var exploreRouter = require("./routes/explore");

// Connect database
var mysql = require("mysql");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'vuduy',  
  database : 'insta_clone'
});

// var connection = require('./database/database')

// var a, b;
// async function getquery() {
//     a = await connection.query("SELECT image_url, photos.created_at, IFNULL(caption,'') as caption, username FROM photos INNER JOIN users ON photos.user_id = users.id WHERE photos.id = ?", 2);
//     b = await connection.query("SELECT comments.id, users.username, comments.created_at, comments.comment_text FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.photo_id = (SELECT photos.id FROM photos WHERE photos.id = ?)", 2)
//     console.log(a[0]);
//     console.log(b[0]);
//     console.log(b[1]);
// }
// getquery();
// connection.query("SELECT * FROM users", function(err, results) {
//     if(err) throw err;
//     console.log(results);
// });


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// Set up session
app.use(require("express-session")({
    secret: "Secret World....",
    resave: false,
    saveUninitialized: false
}));

// Set up passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
// used to deserialize the user
passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
        console.log("de"+rows);
        done(err, rows[0]);
    });
});

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  console.log(req.user);
  next();
});

passport.use(
    'local-signup',
    new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
            if (err)
                return done(err);
            if (rows.length) {
                return done(null, false);
            } else {
                // if there is no user with that username
                // create the user
                var newUserMysql = {
                    username: username,
                    password: password //use the generateHash function in our user model
                };

                var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                // Insert user
                connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                    if(err) throw err;
                    newUserMysql.id = rows.insertId;
                      console.log(newUserMysql);

                    return done(null, newUserMysql);
                });
            }
        });
    })
);

passport.use(
    'local-login',
    new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
        connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false)//, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!(password==rows[0].password))
                return done(null, false) //req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, rows[0]);
        });
    })
);

// Use routes
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/users/:username/follows", followRouter);
app.use("/photos", photoRouter);
app.use("/photos/:pid/comments", commentRouter);
app.use("/photos/:pid/likes", likeRouter);
app.use("/explore", exploreRouter);

app.listen(8080, function() {
    console.log("Server is on");
})

// Middleware
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		return next();
	}
	console.log(req.user);
	// if they aren't redirect them to the home page
	res.redirect('/');
}