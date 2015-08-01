'use strict';

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Donation = mongoose.model('Donation'),
    _ = require('lodash');

exports.create = function(req, res) {
	console.log('donations.create');
	var donation = new Donation(req.body);
	donation.user = req.user;

	donation.save(function(err, donation) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			return res.json(donation);
		}
	});
};

exports.read = function(req, res) {
	res.jsonp(req.donation);
};

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

exports.list = function(req, res) { 
	Donation.find().
		sort('-created').
		populate('donor').
		exec(function(err, donations) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(donations);
			}
		});
};

exports.donationByID = function(req, res, next, id) { 
	Donation.findById(id).
		populate('donor').
		exec(function(err, donation) {
			if (err) return next(err);
			if (! donation) return next(new Error('Failed to load Donation ' + id));
			req.donation = donation;
			next();
		});
};

exports.hasAuthorization = function(req, res, next) {
	if (req.donation.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.addItem = function(req, res) {
	var donation = req.donation;
	var item = req.body;
	item._id = mongoose.Types.ObjectId();
	donation.items.push(item);
	donation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(donation.items[donation.items.length - 1]);
		}
	});
};

exports.deleteItem = function(req, res) {
	var donation = req.donation;
	var item = req.body;
	item._id = mongoose.Types.ObjectId();

	var index = -1;
	for (var i in donation.items) {
		if (donation.items[i]._id.toString() === req.params.itemId) {
			index = i;
			break;
		}
	}
	if (index === -1) {
		return res.status(404).send({
			message: 'That note does not exist with this cat.'
		});
	}

	donation.items.splice(index, 1);
	donation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json({message: 'Succesfully deleted.'});
		}
	});
};
