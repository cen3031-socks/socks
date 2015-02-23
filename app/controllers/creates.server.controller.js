'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Create = mongoose.model('Create'),
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
	var create = new Create(req.body);
	var password = create.email.hashCode();
	create.password = password;
	create.user = req.user;

	create.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(create);
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
			console.log(create);
			var mailOptions = {
   				from: 'Fred Foo <saveourcatsandkittens@gmail.com>', // sender address
  			  	to: create.email, // list of receivers
    			subject: 'Welcome to SOCKS! ', // Subject line
   			 	text: 'Login by using the following password to reset it:\n Password: ' + create.password, // plaintext body
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
	};

/**
 * Show the current Create
 */
exports.read = function(req, res) {
	res.jsonp(req.create);
};

/**
 * Update a Create
 */
exports.update = function(req, res) {
	var create = req.create ;

	create = _.extend(create , req.body);

	create.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(create);
		}
	});
};

/**
 * Delete an Create
 */
exports.delete = function(req, res) {
	var create = req.create ;

	create.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(create);
		}
	});
};

/**
 * List of Creates
 */
exports.list = function(req, res) { 
	Create.find().sort('-created').populate('user', 'displayName').exec(function(err, creates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(creates);
		}
	});
};

/**
 * Create middleware
 */
exports.createByID = function(req, res, next, id) { 
	Create.findById(id).populate('user', 'displayName').exec(function(err, create) {
		if (err) return next(err);
		if (! create) return next(new Error('Failed to load Create ' + id));
		req.create = create ;
		next();
	});
};

/**
 * Create authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.create.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
