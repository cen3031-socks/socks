/* 'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Donation = mongoose.model('Donation'),
	agent = request.agent(app);






var credentials, user, donation;





describe('Donation CRUD tests', function() {
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

		// Save a user to the test db and create new Donation
		user.save(function() {
			donation = {
				name: 'Donation Name'
			};

			done();
		});
	});

	it('should be able to save Donation instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Donation
				agent.post('/donations')
					.send(donation)
					.expect(200)
					.end(function(donationSaveErr, donationSaveRes) {
						// Handle Donation save error
						if (donationSaveErr) done(donationSaveErr);

						// Get a list of Donations
						agent.get('/donations')
							.end(function(donationsGetErr, donationsGetRes) {
								// Handle Donation save error
								if (donationsGetErr) done(donationsGetErr);

								// Get Donations list
								var donations = donationsGetRes.body;

								// Set assertions
								(donations[0].user._id).should.equal(userId);
								(donations[0].name).should.match('Donation Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Donation instance if not logged in', function(done) {
		agent.post('/donations')
			.send(donation)
			.expect(401)
			.end(function(donationSaveErr, donationSaveRes) {
				// Call the assertion callback
				done(donationSaveErr);
			});
	});

	it('should not be able to save Donation instance if no name is provided', function(done) {
		// Invalidate name field
		donation.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Donation
				agent.post('/donations')
					.send(donation)
					.expect(400)
					.end(function(donationSaveErr, donationSaveRes) {
						// Set message assertion
						(donationSaveRes.body.message).should.match('Please fill Donation name');
						
						// Handle Donation save error
						done(donationSaveErr);
					});
			});
	});

	it('should be able to update Donation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Donation
				agent.post('/donations')
					.send(donation)
					.expect(200)
					.end(function(donationSaveErr, donationSaveRes) {
						// Handle Donation save error
						if (donationSaveErr) done(donationSaveErr);

						// Update Donation name
						donation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Donation
						agent.put('/donations/' + donationSaveRes.body._id)
							.send(donation)
							.expect(200)
							.end(function(donationUpdateErr, donationUpdateRes) {
								// Handle Donation update error
								if (donationUpdateErr) done(donationUpdateErr);

								// Set assertions
								(donationUpdateRes.body._id).should.equal(donationSaveRes.body._id);
								(donationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Donations if not signed in', function(done) {
		// Create new Donation model instance
		var donationObj = new Donation(donation);

		// Save the Donation
		donationObj.save(function() {
			// Request Donations
			request(app).get('/donations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Donation if not signed in', function(done) {
		// Create new Donation model instance
		var donationObj = new Donation(donation);

		// Save the Donation
		donationObj.save(function() {
			request(app).get('/donations/' + donationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', donation.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Donation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Donation
				agent.post('/donations')
					.send(donation)
					.expect(200)
					.end(function(donationSaveErr, donationSaveRes) {
						// Handle Donation save error
						if (donationSaveErr) done(donationSaveErr);

						// Delete existing Donation
						agent.delete('/donations/' + donationSaveRes.body._id)
							.send(donation)
							.expect(200)
							.end(function(donationDeleteErr, donationDeleteRes) {
								// Handle Donation error error
								if (donationDeleteErr) done(donationDeleteErr);

								// Set assertions
								(donationDeleteRes.body._id).should.equal(donationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Donation instance if not signed in', function(done) {
		// Set Donation user 
		donation.user = user;

		// Create new Donation model instance
		var donationObj = new Donation(donation);

		// Save the Donation
		donationObj.save(function() {
			// Try deleting Donation
			request(app).delete('/donations/' + donationObj._id)
			.expect(401)
			.end(function(donationDeleteErr, donationDeleteRes) {
				// Set message assertion
				(donationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Donation error error
				done(donationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Donation.remove().exec();
		done();
	});
});*/