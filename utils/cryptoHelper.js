"use strict";

var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');

var key = 'R8z151FDG#1,aNZ:59D#5b7d~Kdds5';
var salt = '|daCAdRz !+S)];K.K=4C)-B9-I(Ft|:>HR+))Pe}U9;n,MC<,|7qw5B#]b{*@xN';
var saltFactor = 12;

exports.encrypt = function(text) {
	var cipher = crypto.createCipher('aes-256-cbc', key);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
};

exports.decrypt = function(text) {
	if (text === null || typeof text === "undefined") { return text; }
	var decipher = crypto.createDecipher('aes-256-cbc', key);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
};

exports.makeBcryptHash = function(bacon) {
	return bcrypt.hashSync(bacon, bcrypt.genSaltSync(saltFactor));
};

exports.makeSHAHash = function(bacon) {
	return crypto.createHmac('sha256', salt).update(bacon).digest('hex');
};

exports.comparePassword = function(entered, stored) {
	return bcrypt.compareSync(entered, stored);
}