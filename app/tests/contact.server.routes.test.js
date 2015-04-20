 'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Contact = mongoose.model('Contact'),
	agent = request.agent(app);

//var credentials, user, contact;
var credentials, credentials2, credentials3, employee, volunteer, admin, contact1, contact2;



describe('Contact CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};
		credentials2 = {
			username: 'testing',
			password: 'testing'
		};
		credentials3 = {
			username: 'admin',
			password: 'pass'
		};
		// Save a user to the test db and create new Contact
		contact1 = new Contact({
			firstName: 'Aaron',
			surname: 'Silcott'
		});
		contact1.save(function(){
			// Create a new user
			employee = new User({
				username: credentials.username,
				password: credentials.password,
				contact: contact1,
				permissionLevel: 1
			});
			employee.save(function(){
				volunteer = new User({
					username: credentials2.username,
					password: credentials2.password,
					contact: contact1,
					permissionLevel: 2
				});
				volunteer.save(function(){
					admin = new User({
						username: credentials3.username,
						password: credentials3.password,
						contact: contact1,
						permissionLevel: 0
					});
					admin.save(function(){
						contact2 = new Contact({
							firstName: 'tom',
							surname: 'sawyer'
						})
						done();
					});
				});
			});
		});
	});
	it('Should save Contact if signed in as Admin', function(done) {
		agent.post('/auth/signin')
			.send(credentials3)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Contact
				agent.post('/contacts')
					.send(contact2)
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
								//(contacts[0].user._id).should.equal(userId);
								
								(contacts[0].firstName).should.match('tom');

								// Call the assertion callback
								done();
							});
					});
			});
	});
	it('Should save Contact if signed in as employee', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Contact
				agent.post('/contacts')
					.send(contact2)
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
								//(contacts[0].user._id).should.equal(userId);
								
								(contacts[0].firstName).should.match('tom');

								// Call the assertion callback
								done();
							});
					});
			});
	});
	it('Should save Contact if signed in as volunteer', function(done) {
		agent.post('/auth/signin')
			.send(credentials2)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Contact
				agent.post('/contacts')
					.send(contact2)
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
								//(contacts[0].user._id).should.equal(userId);
								
								(contacts[0].firstName).should.match('tom');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('Should reject Contact if not logged in', function(done) {
		/*agent.post('/contacts')
			.send(contact)
			.expect(401)
			.end(function(contactSaveErr, contactSaveRes) {
				// Call the assertion callback
				done(contactSaveErr);
			});*/
		agent.post('/contacts')
			.send(contact1)
			.expect(401)
			.end(function(contactSaveErr, contactSaveRes){
				if (contactSaveErr) done(contactSaveErr);
				agent.post('/auth/signin')
					.send(credentials3)
					.expect(200)
					.end(function(signinErr, signinRes) {
						// Handle signin error
						if (signinErr) done(signinErr);
						agent.get('/contacts')
							.end(function(contactGetErr, contactGetRes){
								if(contactGetErr) done(contactGetRes);
								var contacts = contactGetRes.body;

								contacts.length.should.equal(1);
								done();
						});
				});
		});
	});
	it('Should Get Contacts if signed in as Admin', function(done) {
		agent.post('/auth/signin')
			.send(credentials3)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Contact
				agent.get('/contacts')
					.expect(200)
					.end(function(contactGetErr, contactGetRes) {
						// Handle Contact save error
						if (contactGetErr) done(contactGetErr);
						contactGetRes.body.should.be.an.Array.with.lengthOf(1);
						done();
					});
			});
	});
	it('Should Get Contacts if signed in as employee', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Contact
				agent.get('/contacts')
					.expect(200)
					.end(function(contactGetErr, contactGetRes) {
						// Handle Contact save error
						if (contactGetErr) done(contactGetErr);
						contactGetRes.body.should.be.an.Array.with.lengthOf(1);
						done();
					});
			});
	});
	it('Should Get Contacts if signed in as volunteer', function(done) {
		agent.post('/auth/signin')
			.send(credentials2)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Contact
				agent.get('/contacts')
					.expect(200)
					.end(function(contactGetErr, contactGetRes) {
						// Handle Contact save error
						if (contactGetErr) done(contactGetErr);
						contactGetRes.body.should.be.an.Array.with.lengthOf(1);
						done();
					});
			});
	});
	it('Should reject Get Contact if not logged in', function(done) {
		/*agent.post('/contacts')
			.send(contact)
			.expect(401)
			.end(function(contactSaveErr, contactSaveRes) {
				// Call the assertion callback
				done(contactSaveErr);
			});*/
			agent.get('/contacts')
				.expect(401)
				.end(function(contactGetErr, contactGetRes){
					done(contactGetErr);
			});
	});


	it('Should Update Contacts if signed in as admin', function(done) {
		agent.post('/auth/signin')
			.send(credentials3)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// sign out
				agent.get('/auth/signout')
					.end(function(signoutErr, signoutRes) {
						// Handle Contact save error
						if (signoutErr) done(signoutErr);

						// Update Contact name
						contact1.firstName = 'WHY YOU GOTTA BE SO MEAN?';
						

						agent.post('/auth/signin')
							.send(credentials3)
							.expect(200)
							.end(function(signinErr, signinRes){

								// Update existing Contact
								agent.put('/contacts/' + contact1._id)
									.send(contact1)
									.expect(200)
									.end(function(contactUpdateErr, contactUpdateRes) {
										// Handle Contact update error
										if (contactUpdateErr) done(contactUpdateErr);

										// Set assertions
										//((int)contactUpdateRes.body._id).should.eql(contact1._id);
										(contactUpdateRes.body.firstName).should.match('WHY YOU GOTTA BE SO MEAN?');

										// Call the assertion callback
										done();
									});
							});
					});
			});
	});
 it('Should Update Contacts if signed in as employee', function(done) {
		agent.post('/auth/signin')
			.send(credentials3)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// sign out
				agent.get('/auth/signout')
					.end(function(signoutErr, signoutRes) {
						// Handle Contact save error
						if (signoutErr) done(signoutErr);

						// Update Contact name
						contact1.firstName = 'WHY YOU GOTTA BE SO MEAN?';
						

						agent.post('/auth/signin')
							.send(credentials)
							.expect(200)
							.end(function(signinErr, signinRes){

								// Update existing Contact
								agent.put('/contacts/' + contact1._id)
									.send(contact1)
									.expect(200)
									.end(function(contactUpdateErr, contactUpdateRes) {
										// Handle Contact update error
										if (contactUpdateErr) done(contactUpdateErr);

										// Set assertions
										//((int)contactUpdateRes.body._id).should.eql(contact1._id);
										(contactUpdateRes.body.firstName).should.match('WHY YOU GOTTA BE SO MEAN?');

										// Call the assertion callback
										done();
									});
							});
					});
			});
	});
	it('Should NOT Update Contacts if signed in as volunteer', function(done) {
		agent.post('/auth/signin')
			.send(credentials3)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// sign out
				agent.get('/auth/signout')
					.end(function(signoutErr, signoutRes) {
						// Handle Contact save error
						if (signoutErr) done(signoutErr);

						// Update Contact name
						contact1.firstName = 'WHY YOU GOTTA BE SO MEAN?';
						

						agent.post('/auth/signin')
							.send(credentials2)
							.expect(200)
							.end(function(signinErr, signinRes){

								// Update existing Contact
								agent.put('/contacts/' + contact1._id)
									.send(contact1)
									.expect(403)
									.end(function(contactUpdateErr, contactUpdateRes) {
										done(contactUpdateErr);
									});
							});
					});
			});
	});
	/*it('Should Delete Contacts if signed in as admin', function(done) {
		agent.post('/auth/signin')
			.send(credentials3)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// sign out
				agent.delete('contact/'+ contact1._id)
					.expect(200)
					.end(function(signoutErr, signoutRes) {
						// Handle Contact save error
						if (signoutErr) done(signoutErr);

						agent.get('/contacts')
							.expect(200)
							.end(function(contactGetErr, contactGetRes) {
								// Handle Contact save error
								if (contactGetErr) done(contactGetErr);
								contactGetRes.body.should.be.an.Array.with.lengthOf(0);
								done();
							});
					});
			});
	});*/


/*
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
 */

	afterEach(function(done) {
		User.remove().exec();
		Contact.remove().exec();
		done();
	});
});
