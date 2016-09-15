"use strict";

var cryptoHelper = require("../utils/cryptoHelper");

var models = require( "../models" );
var bunyan = require("bunyan");
var log = bunyan.createLogger({name: "user"});

module.exports = function( sequelize, DataTypes ){
	var User = sequelize.define("User", {
		email: {
			type: DataTypes.STRING,
			unique: true,
			get: function() { return this.getDataValue( "email" ); },
			set: function(v) { this.setDataValue( "email", v ); }
		},
		password: {
			type: DataTypes.STRING,
			get: function(){ return this.getDataValue("password"); },
			set: function(v){ this.setDataValue("password", v); }
		},
		isAdmin: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			get: function(){ return this.getDataValue("isAdmin"); },
			set: function(v){ this.setDataValue("isAdmin", v); }
		}
	});

	return User;
}