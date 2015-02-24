'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Contact = mongoose.model('Contact'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, contact;

/**
 * Contact routes tests
 */
describe('Contact CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Contact
		user.save(function() {
			contact = {
				name: 'Contact Name'
			};

			done();
		});
	});

	it('should be able to save Contact instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contact
				agent.post('/contacts')
					.send(contact)
					.expect(200)
					.end(function(contactSaveErr, contactSaveRes) {
						// Handle Contact save error
						if (contactSaveErr) done(contactSaveErr);

						// Get a list of Contacts
						agent.get('/contacts')
							.end(function(contactsGetErr, contactsGetRes) {
								// Handle Contact save error
								if (contactsGetErr) done(contactsGetErr);

								// Get Contacts list
								var contacts = contactsGetRes.body;

								// Set assertions
								(contacts[0].user._id).should.equal(userId);
								(contacts[0].name).should.match('Contact Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Contact instance if not logged in', function(done) {
		agent.post('/contacts')
			.send(contact)
			.expect(401)
			.end(function(contactSaveErr, contactSaveRes) {
				// Call the assertion callback
				done(contactSaveErr);
			});
	});

	it('should not be able to save Contact instance if no name is provided', function(done) {
		// Invalidate name field
		contact.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contact
				agent.post('/contacts')
					.send(contact)
					.expect(400)
					.end(function(contactSaveErr, contactSaveRes) {
						// Set message assertion
						(contactSaveRes.body.message).should.match('Please fill Contact name');
						
						// Handle Contact save error
						done(contactSaveErr);
					});
			});
	});

	it('should be able to update Contact instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contact
				agent.post('/contacts')
					.send(contact)
					.expect(200)
					.end(function(contactSaveErr, contactSaveRes) {
						// Handle Contact save error
						if (contactSaveErr) done(contactSaveErr);

						// Update Contact name
						contact.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Contact
						agent.put('/contacts/' + contactSaveRes.body._id)
							.send(contact)
							.expect(200)
							.end(function(contactUpdateErr, contactUpdateRes) {
								// Handle Contact update error
								if (contactUpdateErr) done(contactUpdateErr);

								// Set assertions
								(contactUpdateRes.body._id).should.equal(contactSaveRes.body._id);
								(contactUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Contacts if not signed in', function(done) {
		// Create new Contact model instance
		var contactObj = new Contact(contact);

		// Save the Contact
		contactObj.save(function() {
			// Request Contacts
			request(app).get('/contacts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Contact if not signed in', function(done) {
		// Create new Contact model instance
		var contactObj = new Contact(contact);

		// Save the Contact
		contactObj.save(function() {
			request(app).get('/contacts/' + contactObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', contact.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Contact instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contact
				agent.post('/contacts')
					.send(contact)
					.expect(200)
					.end(function(contactSaveErr, contactSaveRes) {
						// Handle Contact save error
						if (contactSaveErr) done(contactSaveErr);

						// Delete existing Contact
						agent.delete('/contacts/' + contactSaveRes.body._id)
							.send(contact)
							.expect(200)
							.end(function(contactDeleteErr, contactDeleteRes) {
								// Handle Contact error error
								if (contactDeleteErr) done(contactDeleteErr);

								// Set assertions
								(contactDeleteRes.body._id).should.equal(contactSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Contact instance if not signed in', function(done) {
		// Set Contact user 
		contact.user = user;

		// Create new Contact model instance
		var contactObj = new Contact(contact);

		// Save the Contact
		contactObj.save(function() {
			// Try deleting Contact
			request(app).delete('/contacts/' + contactObj._id)
			.expect(401)
			.end(function(contactDeleteErr, contactDeleteRes) {
				// Set message assertion
				(contactDeleteRes.body.message).should.match('User is not logged in');

				// Handle Contact error error
				done(contactDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Contact.remove().exec();
		done();
	});
});