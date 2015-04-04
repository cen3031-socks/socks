'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var contacts = require('../../app/controllers/contacts.server.controller');

    // Contacts Routes
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

    app.route('contacts/:contactId/donations')
        .get(contacts.findDonations);

    app.route('/contacts/:contactId')
    app.route('/adopters')
        .get(contacts.getAllAdopters);

    app.route('/contacts/:contactId/notes')
        .put(contacts.addNote);
    app.route('/contacts/:contactId/notes/:noteId')
        .delete(contacts.deleteNote);

    // Finish by binding the Contact middleware
    app.param('contactId', contacts.contactByID);
};
