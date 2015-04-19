'use strict';

var images = require('../../app/controllers/images.server.controller');
var users = require('../../app/controllers/users.server.controller');
var donations = require('../../app/controllers/donations.server.controller');
var multer = require('multer');

module.exports = function(app) {
	app.route('/images')
		.get(images.list)
		.put(images.create);
	app.route('/images/:imageId')
		.get(images.read)
		.post(images.update);

    app.route('/images/:imageId/full').get(images.getOriginal);
    app.route('/images/:imageId/thumbnail').get(images.getThumbnail);
    app.route('/images/:imageId/large').get(images.getLarge);

    app.route('/upload-image')
        .post(multer(), images.upload);

	app.param('imageId', images.imageByID);
};
