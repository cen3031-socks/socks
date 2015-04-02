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
exports.donationByID = function(req, res, next, id) { 
	Donation.findById(id).populate('donor').exec(function(err, donation) {
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



function isValidItem(event) {
	// TODO: better event validation
	return true;
}

exports.addItem = function(req, res) {
	if (!isValidItem(req.body)) {
		return res.status(400).send({
			message: 'The given event is invalid.'
		});
	}
	var cat = req.cat;
	var event = req.body;
	event._id = mongoose.Types.ObjectId();
	cat.events.push(event);
	cat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(cat.events[cat.events.length - 1]);
		}
	});
};

exports.deleteItem = function(req, res) {
    var cat = req.cat;
    var note = req.body;
    note._id = mongoose.Types.ObjectId();

    var index = -1;
    for (var i in cat.notes) {
        if (cat.notes[i]._id.toString() === req.params.noteId) {
            index = i;
            break;
        }
    }
    if (index === -1) {
        return res.status(404).send({
            message: 'That note does not exist with this cat.'
        });
    }

    cat.notes.splice(index, 1);
    cat.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json({message: "Succesfully deleted."});
        }
    });
};