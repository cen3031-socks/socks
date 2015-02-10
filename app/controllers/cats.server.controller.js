'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cat = mongoose.model('Cat'),
	_ = require('lodash');

exports.list = function(req, res) {
	Cat.find().sort('-name').exec(function(err, cats) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(cats);
		}
	});
};

exports.create = function(req, res) {
	var cat = new Cat(req.body);
	cat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(cat);
		}
	});
};
