'use strict';

module.exports    = function(app) {
	var users     = require('../../app/controllers/users.server.controller');
	var contacts  = require('../../app/controllers/contacts.server.controller');
	var employees = require('../../app/controllers/employees.server.controller');

	var requireEmployee = employees.permissionLevel(users.EMPLOYEE);
	var requireVolunteer = employees.permissionLevel(users.VOLUNTEER);

	app.route('/contacts').
		get(requireVolunteer, contacts.list).
		post(requireVolunteer, contacts.create);

	app.route('/contactsHours').
		get(contacts.list).
		post(requireEmployee);

	app.route('/contacts/:contactId').
		get(requireEmployee, contacts.read).
		put(requireEmployee, contacts.update).
		delete(requireEmployee, contacts.delete);

	app.route('/contacts/:contactId/adoptions').
		get(requireEmployee, contacts.findAdoptedCats);

	app.route('/contacts/:contactId/fosters').
		get(contacts.findFosteredCats);

	app.route('/contacts/:contactId/vets').
		get(requireEmployee, contacts.findCatsWithVets);

	app.route('/contacts/:contactId/donations').
		get(requireEmployee, contacts.findDonations);

	app.route('/contacts/:contactId/volunteers').
		get(requireEmployee, contacts.findVolunteerHours);

	app.route('/contacts/:contactId/employees').
		get(contacts.findEmployees);

	app.route('/contacts/:contactId/admins').
		get(contacts.findAdmins);

	app.route('/contact-csv.csv').
		get(contacts.generateCsv);

	app.route('/adopters').
		get(requireEmployee, contacts.getAllAdopters);

	app.param('contactId', contacts.contactByID);
};
