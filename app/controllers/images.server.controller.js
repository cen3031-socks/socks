'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Image = mongoose.model('Image'),
	_ = require('lodash');

/**
 * Create a Donation
 */

exports.create = function(req, res) {
    console.log('Images.create');
	var image = new Image(req.body);
	image.user = req.user;

	image.save(function(err, image) {
		if (err) {
            console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			return res.json(image);
		}
	});
};

/**
 * Show the current image? IDK copied from donations server controller..
 */
exports.read = function(req, res) {
	res.jsonp(req.image);
};

/**
 * Update an Image
 */
exports.update = function(req, res) {
	var image = req.image;

	image = _.extend(image , req.body);

	image.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(image);
		}
	});
};

/**
 * Delete an Image
 */
exports.delete = function(req, res) {
	var image = req.image;

	/*donation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(donation);
		}
	});*/
    
    image.deleted = true;
                                //how do we delete the file??
    res.jsonp(image);
};

/**
 * List of Donations
 */
exports.list = function(req, res) { 
	Donation.find().sort('-created').populate('donor').exec(function(err, donations) {
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
exports.imageByID = function(req, res, next, id) { 
	Image.findById(id).populate('image').exec(function(err, image) {
		if (err) return next(err);
		if (! donation) return next(new Error('Failed to load Image ' + id));
		req.image = image;
		next();
	});
};
