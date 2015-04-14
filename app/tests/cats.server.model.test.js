'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Cat = mongoose.model('Cat'),
	Contact = mongoose.model('Contact');

var cat, contact;

describe('Cats Model Unit Tests:', function(){
	beforeEach(function(done) {
		contact = new Contact({
			firstName: 'FirstName',
			surname: 'surname'
		});
		contact.save(function(){ 
			cat = new Cat({
				name: "kiddy",
				
			})
			done();
		});
	});

	describe('Method Save', function(){
		it('Should save, valid donor, non-empty(1) items, and valid item name  [no value]', function(done) {
			return donation.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Cat.remove().exec();
		Contact.remove().exec();
		done();
	});
});
