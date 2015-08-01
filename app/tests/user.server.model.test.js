'use strict';

/**
 * Module dependencies.
 */
var should   = require('should'),
	mongoose = require('mongoose'),
	Contact  = mongoose.model('Contact'),
	User     = mongoose.model('User');

/**
 * Globals
 */
var user, contact, user2, user3;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	beforeEach(function(done) {
		contact = new Contact({
			firstName: 'Contact Name',
			surname: 'lastName'
		});
		contact.save(function(){
			var rawUser = {
				username: 'aaroniey',
				password: 'password',
				contact: contact
			};
			user = new User(rawUser);
			user2 = new User({
				username: 'asilcott',
				password: 'password2',
				contact: contact
			});
			user3 = new User(rawUser);
			user.save(function(err){
				done();
			});
		});
	});

	describe('Method Save', function() {
		it('Should begin, with one users', function(done) {
			User.count({}, function(err, users) {
				users.should.equal(1);
				done();
			});
		});
		it('Should save, new user, two users after new save attempt', function(done) {
			user2.save(function(err){
				User.count({}, function(err, users) {
					users.should.equal(2);
					done();
				});
			});

		});
		it('Should reject, resave, have one user after resave attempt', function(done) {
			user.save(function(err){
				User.count({}, function(err, users) {
					users.should.equal(1);
					done();
				});
			});
		});

		it('Should save, correct user', function(done) {
			user2.save(function(err) {
				User.findOne({username: user2.username}, function(err, users) {
					should.exist(users);
					done();
				});
			});
		});
		it('Should reject, to save an username already in database again', function(done) {
			user3.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, null password', function(done) {
			user2.password = null;
			user2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, null username', function(done) {
			user2.username = null;
			user2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, null contact', function(done) {
			user2.contact = null;
			user2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, invalid contact', function(done) {
			user2.contact = 'abcd';
			user2.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should save, passed permissionLevel', function(done) {
			user2.permissionLevel =  5;
			user2.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Should reject, negative permissionLevel', function(done) {
			user2.permissionLevel = -5;
			user2.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		User.remove().exec();
		Contact.remove().exec();

		done();
	});
});
describe('User Model Unit Tests:', function() {
	beforeEach(function(done) {
		contact = new Contact({
			firstName: 'Contact Name',
			surname: 'lastName'
		});
		contact.save(function(){
			user = new User({
				username: 'aaroniey',
				password: 'password',
				contact: contact
			});
			user2 = new User({
				username: 'asilcott',
				password: 'password2',
				contact: contact
			});
			user3 = user;
			user.save(function(err){
				done();
			});
		});
	});

	describe('Method Authenticate', function() {


	});

	afterEach(function(done) { 
		User.remove().exec();
		Contact.remove().exec();

		done();
	});
});
