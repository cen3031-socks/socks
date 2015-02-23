'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Donation = mongoose.model('Donation'),
	_ = require('lodash');

/**
 * Create a Donation
 */
exports.create = function(req, res) {
	var donation = new Donation(req.body);
	donation.user = req.user;

	donation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(donation);
		}
	});
};

/**
 * Show the current Donation
 */
exports.read = function(req, res) {
	res.jsonp(req.donation);
};

/**
 * Update a Donation
 */
exports.update = function(req, res) {
	var donation = req.donation ;

	donation = _.extend(donation , req.body);

	donation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(donation);
		}
	});
};

/**
 * Delete an Donation
 */
exports.delete = function(req, res) {
	var donation = req.donation ;

	donation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(donation);
		}
	});
};

/**
 * List of Donations
 */
exports.list = function(req, res) { 
	Donation.find().sort('-created').populate('user', 'displayName').exec(function(err, donations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(donations);
		}
	});
};

/**
 * Donation middleware
 */
exports.donationByID = function(req, res, next, id) { 
	Donation.findById(id).populate('user', 'displayName').exec(function(err, donation) {
		if (err) return next(err);
		if (! donation) return next(new Error('Failed to load Donation ' + id));
		req.donation = donation ;
		next();
	});
};

/**
 * Donation authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.donation.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
