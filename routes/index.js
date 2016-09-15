var fs = require("fs");
var path = require("path");

fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== "index.js");
	})
	.forEach(function(file) {
		var name = file.replace('.js', '');
		exports[name] = require("./" + file);
	});
