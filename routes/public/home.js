var models = require('../../models');
var cryptoHelper = require('../../utils/cryptoHelper');
var async = require("async");
var fs = require("fs");

module.exports = function( req, res ){
	res.statusCode = 200;
	res.end("ok");
	return;
}

