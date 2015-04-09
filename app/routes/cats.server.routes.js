'use strict';

var users = require('../../app/controllers/users.server.controller'),
	cats = require('../../app/controllers/cats.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/cats')
		.get(cats.list)
		.post(cats.create);
	app.route('/cats/:catId').get(cats.view);
	app.route('/cats/:catId/events')
		.post(cats.addEvent);
	app.route('/cats/:catId/events/:eventId')
		.put(cats.editEvent)
		.delete(cats.deleteEvent);
	app.route('/cats/:catId/adoptions')
		.post(cats.adopt);
	app.route('/cats/:catId/adoptions/:adoptionId')
		.put(cats.unadopt);

    app.route('/cat-csv')
        .get(cats.generateCsv);

	// Finish by binding the cat middleware
	app.param('catId', cats.catById);
	app.param('adoptionId', cats.adoptionById);
};
