'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Create = mongoose.model('Create'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, create;

/**
 * Create routes tests
 */
describe('Create CRUD tests', function() {
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

		// Save a user to the test db and create new Create
		user.save(function() {
			create = {
				name: 'Create Name'
			};

			done();
		});
	});

	it('should be able to save Create instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Create
				agent.post('/creates')
					.send(create)
					.expect(200)
					.end(function(createSaveErr, createSaveRes) {
						// Handle Create save error
						if (createSaveErr) done(createSaveErr);

						// Get a list of Creates
						agent.get('/creates')
							.end(function(createsGetErr, createsGetRes) {
								// Handle Create save error
								if (createsGetErr) done(createsGetErr);

								// Get Creates list
								var creates = createsGetRes.body;

								// Set assertions
								(creates[0].user._id).should.equal(userId);
								(creates[0].name).should.match('Create Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Create instance if not logged in', function(done) {
		agent.post('/creates')
			.send(create)
			.expect(401)
			.end(function(createSaveErr, createSaveRes) {
				// Call the assertion callback
				done(createSaveErr);
			});
	});

	it('should not be able to save Create instance if no name is provided', function(done) {
		// Invalidate name field
		create.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Create
				agent.post('/creates')
					.send(create)
					.expect(400)
					.end(function(createSaveErr, createSaveRes) {
						// Set message assertion
						(createSaveRes.body.message).should.match('Please fill Create name');
						
						// Handle Create save error
						done(createSaveErr);
					});
			});
	});

	it('should be able to update Create instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Create
				agent.post('/creates')
					.send(create)
					.expect(200)
					.end(function(createSaveErr, createSaveRes) {
						// Handle Create save error
						if (createSaveErr) done(createSaveErr);

						// Update Create name
						create.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Create
						agent.put('/creates/' + createSaveRes.body._id)
							.send(create)
							.expect(200)
							.end(function(createUpdateErr, createUpdateRes) {
								// Handle Create update error
								if (createUpdateErr) done(createUpdateErr);

								// Set assertions
								(createUpdateRes.body._id).should.equal(createSaveRes.body._id);
								(createUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Creates if not signed in', function(done) {
		// Create new Create model instance
		var createObj = new Create(create);

		// Save the Create
		createObj.save(function() {
			// Request Creates
			request(app).get('/creates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Create if not signed in', function(done) {
		// Create new Create model instance
		var createObj = new Create(create);

		// Save the Create
		createObj.save(function() {
			request(app).get('/creates/' + createObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', create.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Create instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Create
				agent.post('/creates')
					.send(create)
					.expect(200)
					.end(function(createSaveErr, createSaveRes) {
						// Handle Create save error
						if (createSaveErr) done(createSaveErr);

						// Delete existing Create
						agent.delete('/creates/' + createSaveRes.body._id)
							.send(create)
							.expect(200)
							.end(function(createDeleteErr, createDeleteRes) {
								// Handle Create error error
								if (createDeleteErr) done(createDeleteErr);

								// Set assertions
								(createDeleteRes.body._id).should.equal(createSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Create instance if not signed in', function(done) {
		// Set Create user 
		create.user = user;

		// Create new Create model instance
		var createObj = new Create(create);

		// Save the Create
		createObj.save(function() {
			// Try deleting Create
			request(app).delete('/creates/' + createObj._id)
			.expect(401)
			.end(function(createDeleteErr, createDeleteRes) {
				// Set message assertion
				(createDeleteRes.body.message).should.match('User is not logged in');

				// Handle Create error error
				done(createDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Create.remove().exec();
		done();
	});
});