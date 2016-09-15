"use strict";

var models = require('../../models');
var cryptoHelper = require('../../utils/cryptoHelper');

module.exports = function (req, res, next) {

	models.User.find({
		where: { id : req.user.id }
	})
	.then( function( usr ){
		if( !usr ){
			res.statusCode = 404;
			res.end("user not found", next);
			return;
		}
		res.statusCode = 200;
		res.end( JSON.stringify( usr ), next);
	});
}