'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Donation = mongoose.model('Donation');

/**
 * Globals
 */
var user, donation;

/**
 * Unit tests
 */
describe('Donation Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});


		user.save(function() {
			contact = new Contact({
				firstName: 'FirstName',
				surname: "surname"
			});
			contact.save(function(){ 
				donation = new Donation({
					donor: contact._id
				});
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return donation.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without a contact', function(done) { 
			donation.name = '';

			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Donation.remove().exec();
		User.remove().exec();

		done();
	});
});