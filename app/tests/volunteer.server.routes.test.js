'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Volunteer = mongoose.model('Volunteer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, volunteer;

/**
 * Volunteer routes tests
 */
describe('Volunteer CRUD tests', function() {
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

		// Save a user to the test db and create new Volunteer
		user.save(function() {
			volunteer = {
				name: 'Volunteer Name'
			};

			done();
		});
	});

	it('should be able to save Volunteer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Volunteer
				agent.post('/volunteers')
					.send(volunteer)
					.expect(200)
					.end(function(volunteerSaveErr, volunteerSaveRes) {
						// Handle Volunteer save error
						if (volunteerSaveErr) done(volunteerSaveErr);

						// Get a list of Volunteers
						agent.get('/volunteers')
							.end(function(volunteersGetErr, volunteersGetRes) {
								// Handle Volunteer save error
								if (volunteersGetErr) done(volunteersGetErr);

								// Get Volunteers list
								var volunteers = volunteersGetRes.body;

								// Set assertions
								(volunteers[0].user._id).should.equal(userId);
								(volunteers[0].name).should.match('Volunteer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Volunteer instance if not logged in', function(done) {
		agent.post('/volunteers')
			.send(volunteer)
			.expect(401)
			.end(function(volunteerSaveErr, volunteerSaveRes) {
				// Call the assertion callback
				done(volunteerSaveErr);
			});
	});

	it('should not be able to save Volunteer instance if no name is provided', function(done) {
		// Invalidate name field
		volunteer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Volunteer
				agent.post('/volunteers')
					.send(volunteer)
					.expect(400)
					.end(function(volunteerSaveErr, volunteerSaveRes) {
						// Set message assertion
						(volunteerSaveRes.body.message).should.match('Please fill Volunteer name');
						
						// Handle Volunteer save error
						done(volunteerSaveErr);
					});
			});
	});

	it('should be able to update Volunteer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Volunteer
				agent.post('/volunteers')
					.send(volunteer)
					.expect(200)
					.end(function(volunteerSaveErr, volunteerSaveRes) {
						// Handle Volunteer save error
						if (volunteerSaveErr) done(volunteerSaveErr);

						// Update Volunteer name
						volunteer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Volunteer
						agent.put('/volunteers/' + volunteerSaveRes.body._id)
							.send(volunteer)
							.expect(200)
							.end(function(volunteerUpdateErr, volunteerUpdateRes) {
								// Handle Volunteer update error
								if (volunteerUpdateErr) done(volunteerUpdateErr);

								// Set assertions
								(volunteerUpdateRes.body._id).should.equal(volunteerSaveRes.body._id);
								(volunteerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Volunteers if not signed in', function(done) {
		// Create new Volunteer model instance
		var volunteerObj = new Volunteer(volunteer);

		// Save the Volunteer
		volunteerObj.save(function() {
			// Request Volunteers
			request(app).get('/volunteers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Volunteer if not signed in', function(done) {
		// Create new Volunteer model instance
		var volunteerObj = new Volunteer(volunteer);

		// Save the Volunteer
		volunteerObj.save(function() {
			request(app).get('/volunteers/' + volunteerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', volunteer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Volunteer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Volunteer
				agent.post('/volunteers')
					.send(volunteer)
					.expect(200)
					.end(function(volunteerSaveErr, volunteerSaveRes) {
						// Handle Volunteer save error
						if (volunteerSaveErr) done(volunteerSaveErr);

						// Delete existing Volunteer
						agent.delete('/volunteers/' + volunteerSaveRes.body._id)
							.send(volunteer)
							.expect(200)
							.end(function(volunteerDeleteErr, volunteerDeleteRes) {
								// Handle Volunteer error error
								if (volunteerDeleteErr) done(volunteerDeleteErr);

								// Set assertions
								(volunteerDeleteRes.body._id).should.equal(volunteerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Volunteer instance if not signed in', function(done) {
		// Set Volunteer user 
		volunteer.user = user;

		// Create new Volunteer model instance
		var volunteerObj = new Volunteer(volunteer);

		// Save the Volunteer
		volunteerObj.save(function() {
			// Try deleting Volunteer
			request(app).delete('/volunteers/' + volunteerObj._id)
			.expect(401)
			.end(function(volunteerDeleteErr, volunteerDeleteRes) {
				// Set message assertion
				(volunteerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Volunteer error error
				done(volunteerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Volunteer.remove().exec();
		done();
	});
});