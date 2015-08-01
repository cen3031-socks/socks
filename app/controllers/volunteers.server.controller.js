'use strict';

/**
 * Module dependencies.
 */
var mongoose     = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Volunteer    = mongoose.model('Volunteer'),
    _            = require('lodash');

/**
 * Create a Volunteer
 */
exports.create = function(req, res) {
	var volunteer = new Volunteer(req.body);
	volunteer.user = req.user;

	volunteer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(volunteer);
		}
	});
};

/**
 * Show the current Volunteer
 */
exports.read = function(req, res) {
	res.jsonp(req.volunteer);
};

/**
 * Update a Volunteer
 */
exports.update = function(req, res) {
	var volunteer = req.volunteer ;

	volunteer = _.extend(volunteer , req.body);

	volunteer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(volunteer);
		}
	});
};


/**
 * Delete an Volunteer
 */
exports.delete = function(req, res) {
	var volunteer = req.volunteer ;

	volunteer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(volunteer);
		}
	});
};

exports.getVolunteerByName = function(req, res) {
	Volunteer.find({contact:req.params.contactId,timeOut: null}).exec(function(err, volunteers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(volunteers);
		}
	});
};

/*
 *Get hours worked by a volunteer
 */

exports.minutesWorked = function(req, res) {
	var startEntered = true;
	var endEntered = true;
	if (isNaN(req.params.startDate)) {
		req.params.startDate = new Date();
		req.params.startDate.setYear(2000);
		startEntered = false;
	}
	if (isNaN(req.params.endDate)) {
		req.params.endDate = new Date();
		req.params.endDate.setYear(2500);
		endEntered = false;
	}
	var minutes = 0;
	var MILLIS_PER_MINUTE = 60 * 1000;
	Volunteer.find({contact:req.params.contactId})
	.exec(errorHandler.wrap(res, function(vols) {
		for (var i = 0; i < vols.length; ++i) {

			var timeOut = vols[i].timeOut || Date.now();
			var isInRange = (vols[i].timeIn - req.params.startDate >= 0) && (timeOut - req.params.endDate <= 0);
			if (isInRange) {
				minutes += ((timeOut - vols[i].timeIn) / MILLIS_PER_MINUTE);
			}
		}

		var isVolunteeringNow = false;
		if (vols.length !== 0 && vols[vols.length-1].timeOut === null) {
			isVolunteeringNow = true;
		}
		res.jsonp({minutes: minutes, startEntered:startEntered, endEntered:endEntered, isVolunteeringNow:isVolunteeringNow});
	}));
};

exports.list = function(req, res) { 
	Volunteer.find().sort('-created').populate('contact').exec(function(err, volunteers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(volunteers);
		}
	});
};

/**
 * Volunteer middleware
 */
exports.volunteerByID = function(req, res, next, id) { 
	Volunteer.findById(id).populate('contact').exec(function(err, volunteer) {
		if (err) return next(err);
		if (!volunteer) return next(new Error('Failed to load Volunteer ' + id));
		req.volunteer = volunteer ;
		next();
	});
};

/**
 * Volunteer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.volunteer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

