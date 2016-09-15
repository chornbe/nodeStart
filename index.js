"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var http = require("http");
var https = require("https");
var fs = require("fs");
var path = require("path");
var stylus = require("stylus");

var Sequelize = require("sequelize");

var routes = require("./routes");

var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "index"});

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/config/config.json")[env];

var models = require("./models");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var passportStrategies = require("./config/passport");

// set up the authentication
passport.use(new LocalStrategy(passportStrategies.local));
passport.serializeUser(function (user, done) {
	done(null, user.id);
});
passport.deserializeUser(function (id, done) {
	models.User.find(
		{ where: { id:id } }
	).then(function (user) {
		var err = "";
		if(!user) {
			err = "user not found";
		}
		done(err, user);
	});
});

var app = express();
function compile(str, path) {
	return stylus(str)
		.set("filename", path)
		.set("compress", true)
		.use(nib())
		.import("nib");
}

// set up and start the app
app.use(cookieParser());
app.use(session({ secret: "pMrQpbp0hYwhhAvwAVGS" }));
app.use(passport.initialize());
app.use(passport.session());

//app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit:50000 }));
app.use( bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json({limit: "50mb"}));

// set up the server and some of the middleware for page work, static paths, etc
app.set("port", process.env.PORT || 8000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(stylus.middleware({
	src: __dirname + "/views",
	dest: __dirname + "/",
	compile: compile
}));
app.use(express.static(path.join(__dirname, "/")));

// force all to https (optional)
app.all("*", function (req, res, next) {
	if( req.headers["x-forwarded-proto"] && req.headers["x-forwarded-proto"] != "https" ) {
		res.redirect("https://" + req.host + req.url);
	} else {
		res.setHeader('Access-Control-Allow-Origin', '*');
		next();
	}
});

// public API paths / routes
var pubRouter = express.Router();
app.use( "/", pubRouter );
eval(fs.readFileSync("./pubRoutes.js")+'');

// logged-in API paths / routes
var apiRouter = express.Router();
apiRouter.use(isLoggedIn);
app.use( "/api", apiRouter );
eval(fs.readFileSync("./apiRoutes.js")+'');

// always force a db rebuild if this env is set
var force = false;
if( "1" == process.env.ALWAYS_CREATE_THE_DATABASE ){
	console.log("\n\nForced reset of database is set to true\n" );
	force = true;
}

// start up the db sync stuff. 
models.sequelize.sync( {force: force} ).then(function () {
	http.createServer(app).listen(app.get("port"), function() {
		log.info("Listening on port " + app.get("port"));
	});
});

// global utility to see if the user has his object and is logged in
function isLoggedIn(req, res, next) {
	if(req.user) {
		next();
	} else {
		//res.redirect("/login");
		res.statusCode = 403;
		var response = { statusCode: 403, responseText: "not logged in", login: false, url: req.url, method: req.method };
		res.end( JSON.stringify( response ) );
	}
}
