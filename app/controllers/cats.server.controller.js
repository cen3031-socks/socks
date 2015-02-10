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

exports.view = function(req, res) {
    res.json(req.cat);
};

exports.catByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Cat is invalid'
        });
    }
    Cat.findById(id).populate('user', 'displayName').exec(function(err, cat) {
        if (err) return next(err);
        if (!cat) {
            return res.status(404).send({
                message: 'Cat not found'
            });
        }
        req.cat = cat;
        next();
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
