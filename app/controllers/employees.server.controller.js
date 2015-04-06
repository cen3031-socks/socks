'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Contact = mongoose.model('Contact'),
	User = mongoose.model('User'),
	_ = require('lodash'),
    crypto = require('crypto');

var generatePassword = function(length) {
    return crypto.randomBytes(length).toString('hex');
};

var hardcodePassword = function() {
    return 'test_test_test_test';
}

/**
 * Create an employee
 */
exports.create = function(req, res) {
    var contact = new Contact(req.body);
    var password = hardcodePassword(); //generatePassword(24)
	var user = new User(req.body);
    user.username = contact.email;
    user.password = password;
    user.provider = 'local';
    user.contact = contact._id;

    contact.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            user.save(function(err, user) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(user);

                    var nodemailer = require('nodemailer');
                    // create reusable transporter object using SMTP transport
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: { user: 'saveourcatsandkittens@gmail.com', pass: 'kittens0' }
                    });
                    var mailOptions = {
                        from: '<saveourcatsandkittens@gmail.com>',
                        to: contact.email,
                        subject: 'Welcome to SOCKS! ',
                        text: 'Login by using the following password to reset it:\n Password: ' + password,
                        html: ''
                    };
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
};

