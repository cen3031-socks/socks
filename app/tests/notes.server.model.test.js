'use strict';

/**
 * Module dependencies.
 */
var should   = require('should'),
	mongoose = require('mongoose'),
	Contact  = mongoose.model('Contact'),
	User     = mongoose.model('User'),
	Note     = mongoose.model('Note');

/**
 * Globals
 */
var contact, note, user;

/**
 * Unit tests
 */
describe('Note Model Unit Tests:', function() {
	beforeEach(function(done) {
		contact = new Contact({
			firstName: 'FirstName',
			surname: 'surname'
		});
		contact.save(function(){ 
			user = new User({
				username: 'aaron',
				password: 'pass',
				contact: contact,
				permissionLevel: 0

			});
			user.save(function(){
				note = new Note({
					about: contact,
					sender: user,
					message: 'this is a test note'
				});
				done();
			});
		});

	});

	describe('Method Save', function() {
		it('Should save, valid about(contact), valid sender(user), valid message', function(done) {
			return note.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Should reject, valid about(contact), valid sender(user), empty message', function(done) {
			note.message = '';

			return note.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid about(contact), valid sender(user), null message', function(done) {
			note.message = null;

			return note.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid about(contact), invalid sender(random), valid message', function(done) {
			note.sender = '80';
			return note.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid about(contact), invalid sender(null), valid message', function(done) {
			note.sender = null;
			return note.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid about(contact), invalid sender(contact), valid message', function(done) {
			note.sender = contact._id;
			return note.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, invalid about(random), valid sender(user), valid message', function(done) {
			note.about = '80';
			return note.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, invalid about(null), valid sender(user), valid message', function(done) {
			note.about = null;
			return note.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});
	afterEach(function(done) { 
		Contact.remove().exec();
		User.remove().exec();
		Note.remove().exec();

		done();
	});
});
