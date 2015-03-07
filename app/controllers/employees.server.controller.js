'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Employee = mongoose.model('Employee'),
	Contact = mongoose.model('Contact'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Create
 */
exports.create = function(req, res) {
	String.prototype.hashCode = function() {
		var hash = 0, i, chr, len;
  		if (this.length === 0) return hash;
 		 for (i = 0, len = this.length; i < len; i++) {
  			  chr   = this.charCodeAt(i);
  			 hash  = ((hash << 5) - hash) + chr;
  			 hash |= 0; // Convert to 32bit integer
			 }
 			 return hash;
		};
	var employee = new Employee(req.body);
	var password = employee.email.hashCode();
	employee.password = password;

	var user = new User(req.body);
	user.password = employee.password;
	user.email = employee.email;
	user.phone = employee.phone;
	user.displayName = employee.email;
	user.username = employee.email;
	user.phone = employee.phone;
	user.firstName = employee.firstName;
	user.lastName = employee.lastName;
	user.provider = 'local';
	user.parent = employee._id;

	var contact = new Contact(req.body);
	contact.firstName = employee.firstName;
	contact.surname = employee.lastName;
	contact.email = employee.email;
	contact.phone = employee.phone;

	employee.contact = contact;
	employee.user = user;

	console.log(user);
	console.log(user.password);
	console.log(user.parent.firstName);
	
	employee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			user.save(function(err){
				 if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					contact.save(function(err){
				 	if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(employee);
						var nodemailer = require('nodemailer');

						// create reusable transporter object using SMTP transport
						var transporter = nodemailer.createTransport({
	   					service: 'Gmail',
	   					auth: {
	       					user: 'saveourcatsandkittens@gmail.com',
	        				pass: 'kittens0'
	   					 }
						});

					// NB! No need to recreate the transporter object. You can use
				// the same transporter object for all e-mails

				// setup e-mail data with unicode symbols
					console.log(employee);
					console.log(employee.user);
					var mailOptions = {
   						from: 'Fred Foo <saveourcatsandkittens@gmail.com>', // sender address
  					  	to: employee.email, // list of receivers
    					subject: 'Welcome to SOCKS! ', // Subject line
   					 	text: 'Login by using the following password to reset it:\n Password: ' + employee.password, // plaintext body
   						html: '' // html body
					};

		// send mail with defined transport object
						transporter.sendMail(mailOptions, function(error, info){
	   						 if(error){
	       					 console.log(error);
	    					} else{
	       						 console.log('Message sent: ' + info.response);
	    					}
						 });	
					}
					});
				}
			});

			}
		});
	};

/**
 * Show the current Create
 */
exports.read = function(req, res) {
	res.jsonp(req.employee);
};

/**
 * Update a Create
 */
exports.update = function(req, res) {
	var employee = req.employee ;

	employee = _.extend(employee , req.body);

	employee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employee);
		}
	});
};

/**
 * Delete an Create
 */
exports.delete = function(req, res) {
	var employee = req.employee ;

	employee.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employee);
		}
	});
};

/**
 * List of Creates
 */
exports.list = function(req, res) { 
	Employee.find().sort('-created').populate('user', 'displayName').exec(function(err, employees) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(employees);
		}
	});
};

/**
 * Create middleware
 */
exports.employeeByID = function(req, res, next, id) { 
	Employee.findById(id).populate('user', 'displayName').exec(function(err, employee) {
		if (err) return next(err);
		if (! employee) return next(new Error('Failed to load Employee ' + id));
		req.employee = employee ;
		next();
	});
};

/**
 * Create authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.employee.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
