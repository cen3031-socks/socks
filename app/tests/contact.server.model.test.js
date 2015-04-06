'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Contact = mongoose.model('Contact');

/**
 * Globals
 */
var user, contact;

/**
 * Unit tests
 */
describe('Contact Model Unit Tests:', function() {
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
				firstName: 'Contact Name',
				surname: 'lastName'
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('Save valid contact, firstName and surname', function(done) {
			return contact.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('Fail to save contact, empty firstName', function(done) { 
			contact.firstName = '';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Fail to save contact, empty surname', function(done) { 
			contact.surname = '';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Save valid contact, valid state', function(done) {
			contact.state = 'FL';
			return contact.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Fail to save contact, invalid state code', function(done) { 
			contact.state = 'TV';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Save valid contact, valid email', function(done) {
			contact.email = 'asilcott1@gmail.com';
			return contact.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Fail to save contact, invalid email, leading . ', function(done) { 
			contact.email = '.asilcott1@live.com';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Fail to save contact, invalid email, trailing .', function(done) { 
			contact.email = 'asilcott1.@live.com';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Fail to save contact, invalid email, double ..', function(done) { 
			contact.email = 'asilcott1..@live.com';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Fail to save contact, invalid email, leading . ', function(done) { 
			contact.email = 'asilcott1@.live.com';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Fail to save contact, invalid email, trailing .', function(done) { 
			contact.email = 'asilcott1@live.com.';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Fail to save contact, invalid email, double ..', function(done) { 
			contact.email = 'asilcott1@live..com';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Fail to save contact, invalid email,  " in the webaddress', function(done) { 
			contact.email = 'asilcott1@liv"e.com';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Fail to save contact, invalid email, / in th webaddress', function(done) { 
			contact.email = 'asilcott1@live.c/om';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Save valid contact, valid zipcode null', function(done) {
			contact.zipCode = '';
			return contact.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Save valid contact, valid zipcode 5', function(done) {
			contact.zipCode = '12345';
			return contact.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Save valid contact, valid zipcode 9', function(done) {
			contact.zipCode = '123456789';
			return contact.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Fail to save contact, invalid zipcode, wrong size', function(done) { 
			contact.zipCode = '1234';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Fail to save contact, invalid zipcode, not a number', function(done) { 
			contact.zipCode = 'abcde';

			return contact.save(function(err) {
				should.exist(err);
				done();
			});
		});

	});

	afterEach(function(done) { 
		Contact.remove().exec();
		User.remove().exec();

		done();
	});
});