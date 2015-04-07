'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Donation = mongoose.model('Donation'),
	Contact = mongoose.model('Contact');

/**
 * Globals
 */
var contact, donation;

/**
 * Unit tests
 */
describe('Donation Model Unit Tests:', function() {
	beforeEach(function(done) {
		contact = new Contact({
			firstName: 'FirstName',
			surname: "surname"
		});
		contact.save(function(){ 
			donation = new Donation({
				donor: contact
			});
			donation.items.push({name: 'Food'})
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

		it('should be able to save without problems', function(done) {
			return donation.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without a contact', function(done) { 

			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Contact.remove().exec();
		Donation.remove().exec();
		done();
	});
});