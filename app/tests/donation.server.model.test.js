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
		it('Should save, valid donor, non-empty(1) items, and valid item name  [no value]', function(done) {
			return donation.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('Should reject, valid donor, non-empty(1) items, and invalid name [no value]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "not food"});
			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid donor, non-empty(n) items, and one has invalid name [no value]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "Food"});
			donation.items.push({name: "Food"});
			donation.items.push({name: "not food"});
			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid donor, non-empty(1) items, and no name [no value]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({description: "not food"});
			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid donor, non-empty(n) items, one has and no name [no value]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "Food"});
			donation.items.push({name: "Food"});
			donation.items.push({description: "not food"});
			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should save, valid donor, non-empty(1) items, and valid item name  [With value(amount&units)]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "Food", value: {amount: 50, units: 'units'}});
			return donation.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('Should reject, valid donor, non-empty(1) items, and invalid name [with value(amount&units)]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "not food", value: {amount: 50, units: 'units'}});
			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid donor, non-empty(1) items, and one has no name [with value(amount&units)]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({description: "not food", value: {amount: 50, units: 'units'}});
			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should save, valid donor, non-empty(1) items, and valid name [With value(null&null)]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "Food", value: {}});
			return donation.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Should reject, valid donor, non-empty(1) items, and valid name [With value(amount&null)]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "Food", value: {amount: 50}});
			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid donor, non-empty(1) items, and valid name [With value(null&units)]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "Food", value: {units: 'units'}});
			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should save, valid donor, non-empty(n) items, and valid item name  [With value(amount&units)]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "Food", value: {amount: 50, units: 'units'}});
			donation.items.push({name: "Food", value: {amount: 50, units: 'units'}});
			return donation.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Should save, valid donor, non-empty(n) items, and valid name all [With value(null&null)]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "Food", value: {amount: 50, units: 'units'}});
			donation.items.push({name: "Food", value: {}});
			donation.items.push({name: "Food", value: {amount: 50, units: 'units'}});

			return donation.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Should reject, valid donor, non-empty(n) items, and valid name one [With value(amount&null)]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "Food", value: {amount: 50, units: 'units'}});
			donation.items.push({name: "Food", value: {amount: 50, units: 'units'}});
			donation.items.push({name: "Food", value: {amount: 50}});
			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid donor, non-empty(n) items, and valid name one [With value(null&units)]', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.items.push({name: "Food", value: {amount: 50, units: 'units'}});
			donation.items.push({name: "Food", value: {amount: 50, units: 'units'}});
			donation.items.push({name: "Food", value: {units: 'units'}});
			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid donor, empty items', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			return donation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, non-valid donor, empty items', function(done) {
			while(donation.items.length >0){
				donation.items.pop();
			}
			donation.donor = '';
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