'use strict';

var images = require('../../app/controller/images.server.controller');
var users = require('../../app/controllers/users.server.controller');
var donations = require('../../app/controllers/donations.server.controller');


module.exports = function(app) {

	// Donations Routes
	app.route('/images')
		.get(images.list)
		.put(images.create);

	app.route('/images/:imageId')
		.get(images.read)
		.post(images.update);
    
	// Finish by binding the image middleware
	app.param('imageId', donations.donationByID);
};