'use strict';

var mongoose     = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cats         = require('./cats.server.controller'),
	Report       = mongoose.model('Report'),
	_            = require('lodash');

exports.get = function(req, res) {
	res.json(req.report);
};

exports.list = function(req, res) {
	Report.find().exec(errorHandler.wrap(res, function(reports) {
		res.json(reports);
	}));
};

exports.create = function(req, res) {
	var report = new Report(req.body);
	report.save(errorHandler.wrap(res, function(report) {
		res.json(report);
	}));
};

exports.update = function(req, res) {
	var report = _.extend(req.report, req.body);
	report.save(errorHandler.wrap(res, function(report) {
		res.json(report);
	}));
};

exports.getResult = function(req, res) {
	switch (req.report.resultType) {
		case 'Cat': Cats.searchCats(req, res); break;
		default: res.status(400).json({ message: 'Unknown report type.' }); break;
	}
};

exports.temporary = function(req, res, next) {
	req.report = new Report(req.body);
	next();
};

exports.reportById = function(req, res, next, id) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Cat is invalid'
		});
	}
	Report.findById(id)
		.exec(errorHandler.wrap(res, function(report) {
			req.report = report;
			next();
		}));
};

