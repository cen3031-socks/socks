'use strict';

/**
 * Module dependencies.
 */
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
