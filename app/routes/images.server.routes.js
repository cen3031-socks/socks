'use strict';

var images    = require('../../app/controllers/images.server.controller');
var users     = require('../../app/controllers/users.server.controller');
var donations = require('../../app/controllers/donations.server.controller');
var multer    = require('multer');

module.exports = function(app) {
	app.route('/images').
		get(images.list).
		put(images.create);
	app.route('/images/:imageId').
		get(images.read).
		put(images.update);

	app.route('/videos').get(images.listVideos);

	app.route('/images/:imageId/original').get(images.getOriginal);
	app.route('/images/:imageId/thumbnail').get(images.getThumbnail);
	app.route('/images/:imageId/large').get(images.getLarge);

	app.route('/videos/:videoId/get').get(images.getVideo);

	app.route('/upload-image').
		post(multer(), images.upload);

	app.route('/upload-video').post(multer(), images.uploadVideo);

	app.route('/cats/:catId/images').get(images.forCat);

	app.route('/delete-images').post(images.deleteAll);
	app.route('/delete-videos').post(images.deleteAllVideos);

	app.param('imageId', images.imageByID);
	app.param('videoId', images.videoByID);
};
