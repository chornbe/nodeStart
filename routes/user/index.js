"use strict";

var fs = require("fs");
var path = require("path");
var api = {};

fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== "index.js");
	})
	.forEach(function(file) {
		var apiName = file.replace(".js", "");
		api[apiName] = require('./' + file);
	})

module.exports = api;
