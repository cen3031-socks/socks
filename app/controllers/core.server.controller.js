'use strict';

var mongoose     = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Contact      = mongoose.model('Contact'),
	User         = mongoose.model('User'),
	users        = require('./users.server.controller.js');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.volunteers = function(req, res) {
	res.render('volunteer-layout', {
		user: req.user || null,
		request: req
	});
};

/**
* Calls the first callback only if there was no admin created.
* Calls the second one if there has already been an admin created
*/
exports.ifNoAdmin = function(noAdminCallback, adminExistsCallback) {
	User.find().
		exec(function(err, result) {
			if (err) {
				throw err;
			}

			if (result.length === 0) {
				if (noAdminCallback) { noAdminCallback(); }
			} else {
				if (adminExistsCallback) { adminExistsCallback(); }
			}
		});
};

exports.activate = function(req, res) {
	exports.ifNoAdmin(function() {
		res.render('activate', { request: req });
	}, function() {
		res.redirect('/');
	});
};

exports.createAdmin = function(req, res) {
	exports.ifNoAdmin(function() {
		var contact = new Contact(req.body);
		var user = new User(req.body);
		user.permissionLevel = users.ADMIN;

		contact.save(function(err, dbContact) {
			if (err) {
				return res.status(400).json({ message: errorHandler.getErrorMessage(err) });
			}
			user.contact = dbContact._id;
			user.save(function(err, dbUser) {
				if (err) {
					return res.status(400).json({message: errorHandler.getErrorMessage(err)});
				}
				return res.jsonp(dbUser);
			});
		});
	}, function() {
		res.status(403).json({message: 'Cannot create an admin when one has already been created.'});
	});
};
