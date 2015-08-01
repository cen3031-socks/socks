'use strict';

var should   = require('should'),
    mongoose = require('mongoose'),
    Cat      = mongoose.model('Cat'),
    Contact  = mongoose.model('Contact');

var cat, contact;

describe('Cats Model Unit Tests:', function(){
	beforeEach(function(done) {
		contact = new Contact({
			firstName: 'FirstName',
			surname: 'surname'
		});
		contact.save(function(){ 
			cat = new Cat({
				name: 'kiddy',
				sex: 9,
				breed: 'Abyssinian'				
			});
			done();
		});
	});

	describe('Method Save', function(){
		it('Should save, valid name, sex, and breed', function(done) {
			return cat.save(function(err) {
				console.log(err);
				should.not.exist(err);
				done();
			});
		});
		it('Should reject, valid name, sex, invalid breed', function(done) {
			cat.breed = 'your mommma';
			return cat.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid name, sex, null breed', function(done) {
			cat.breed = null;
			return cat.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid name, breed, invalid sex', function(done) {
			cat.sex = 6;
			return cat.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid name, breed, null sex', function(done) {
			cat.sex = null;
			return cat.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should save, valid sex, breed, null name', function(done) {
			cat.name = null;
			return cat.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should save, valid name, breed, invalid sex, valid event', function(done) {
			cat.events.push({
				label: 'this is a label', 
				date: Date.now(),
				eventType: 'type yo',
			});
			return cat.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Should reject, valid name, breed, invalid sex, invalid event(null label)', function(done) {
			cat.events.push({
				label: null, 
				date: Date.now(),
				eventType: 'type yo',
			});
			return cat.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid name, breed, invalid sex, invalid event(null date)', function(done) {
			cat.events.push({
				label: 'null', 
				date: null,
				eventType: 'type yo',
			});
			return cat.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid name, breed, invalid sex, invalid event(null eventType)', function(done) {
			cat.events.push({
				label: 'null', 
				date: Date.now(),
				eventType: null,
			});
			return cat.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should reject, valid name, breed, invalid sex, invalid event(wrong icon)', function(done) {
			cat.events.push({
				label: 'null', 
				date: Date.now(),
				eventType: 'type yo',
				icon: 'this is my icon'
			});
			return cat.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('Should save, valid name, breed, invalid sex, invalid event(valid icon)', function(done) {
			cat.events.push({
				label: 'null', 
				date: Date.now(),
				eventType: 'type yo',
				icon: 'glyphicon-asterisk'
			});
			return cat.save(function(err) {
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
