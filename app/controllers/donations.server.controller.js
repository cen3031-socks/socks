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
	// TODO: better item validation---is this even necessary??
	return true;
}

exports.addItem = function(req, res) {
	if (!isValidItem(req.body)) {
		return res.status(400).send({
			message: 'The given event is invalid.'
		});
	}
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
    var donation = req.donation;						//TODO:
    var item = req.body;								//ummmm will this work? Stolen from alex
    item._id = mongoose.Types.ObjectId();				//from cats.server.controller.deleteNote

    var index = -1;
    for (var i in donation.items) {
        if (donation.items[i]._id.toString() === req.params.itemId) {		//itemID? Where does it exist?
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

/*
exports.editItem = function(req, res) {
	if (!isValidItem(req.body)) {
		return res.status(400).send({
			message: 'The given event is invalid.'
		});
	}
	var donation = req.donation;
	donation.items[req.params.itemIndex] = req.body;			//TODO: edit items? or just delete and
	donation.save(function(err) {								//add a new one..
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(cat.events[req.params.eventIndex]);
		}
	});
};*/
