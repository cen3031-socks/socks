'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var contacts = require('../../app/controllers/contacts.server.controller');

    app.route('/contacts')
        .get(contacts.list)
        .post(contacts.create);

    app.route('/contacts/:contactId')
        .get(contacts.read)
        .put(contacts.update)
        .delete(contacts.delete);

    app.route('/contacts/:contactId/adoptions')
        .get(contacts.findAdoptedCats);

    app.route('/contacts/:contactId/vets')
        .get(contacts.findCatsWithVets);

    app.route('/contacts/:contactId/donations')
        .get(contacts.findDonations);

    app.route('/contacts/:contactId');
    app.route('/contacts/:contactId/volunteers')
        .get(contacts.findVolunteerHours);

    app.route('/adopters')
        .get(contacts.getAllAdopters);

    app.param('contactId', contacts.contactByID);
};
