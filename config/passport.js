var models = require('../models');
var cryptoHelper = require('../utils/cryptoHelper');

var bunyan = require("bunyan");
var log = bunyan.createLogger({name: "authenticateUser"});

exports.local = function (username, password, done) {
	log.info("running the passport authentication function");
	models.User.find({
		where: { email: username, password: password }
	})
	.then( function( user ){
		if(!user){
			log.info("nope, no user found matching these credentials");
			return done( null, false, {message: 'invalid user or password'});
		}
		log.info("user found and is logged in" );
		return done( null, user );
	});
}
