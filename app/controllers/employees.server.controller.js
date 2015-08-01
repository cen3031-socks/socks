'use strict';

var mongoose     = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Contact      = mongoose.model('Contact'),
    User         = mongoose.model('User'),
    _            = require('lodash'),
    crypto       = require('crypto'),
    async        = require('async');

var generatePassword = function(length) {
	return crypto.randomBytes(length).toString('hex');
};

exports.permissionLevel = function(level) {
	return function(req, res, next) {
		if (!req.isAuthenticated()) {
			return res.status(401).send({
				message: 'User is not logged in'
			});
		}

		if (!req.user || req.user.permissionLevel > level) {
			return res.status(403).send({ message: 'You do not have permission to view this page.' });
		} else {
			next();
		}
	};
};

exports.create = function(req, res) {
	var contact  = new Contact(req.body);
	var password = generatePassword(24);
	var user     = new User(req.body);

	user.username = contact.email;
	user.password = password;
	user.provider = 'local';
	user.contact  = contact._id;

	contact.save(errorHandler.wrap(res, function(contact) {
		user.save(errorHandler.wrap(function(err, user) {
			res.jsonp(user);
			var nodemailer = require('nodemailer');
			// create reusable transporter object using SMTP transport
			var transporter = nodemailer.createTransport({
				service: 'Gmail',
				auth: { user: 'saveourcatsandkittens@gmail.com', pass: 'kittens0' }
			});
			var mailOptions = {
				from: '<saveourcatsandkittens@gmail.com>',
				to: contact.email,
				subject: 'Welcome to SOCKS! ',
				text: 'Login by using the following password to reset it:\n Password: ' + password,
				html: ''
			};
			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					console.log(error);
				} else{
					console.log('Message sent: ' + info.response);
				}
			});
		}));
	}));
};

