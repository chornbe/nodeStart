var fs = require("fs");
var path = require("path");
var public = {};

fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== "index.js");
	})
	.forEach(function(file) {
		var name = file.replace('.js', '');
		public[name] = require("./" + file);
	});

module.exports = public;
