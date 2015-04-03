'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * A Validation function to make sure phone number is 10-12 digits long
 */
var validatePhoneNumber= function(phoneNumber) {
    return ( ( (phoneNumber.length >9) && (phoneNumber.length <13) ) || (phoneNumber.length == 0) );
};

/**
 * A Validation function to make sure phone number is 5 or 9 digits long
 */
var validateZipCode= function(zipCode) {
    return ( (zipCode.length == 0) || (zipCode.length == 5) || (zipCode.length == 9) );
};


/**
 * Contact Schema
 */
var ContactSchema = new Schema({
    firstName: {
        type: String,
        default: '',
        trim: true
    },
    surname: {
        type: String,
        default: '',
        trim: true
    },
    address: {
        type: String,
        default: '',
        trim: true
    },
    city: {
        type: String,
        default: '',
        trim: true
    },
    state: {
        type: String,
        default: '',
        trim: true
    },
    zipCode: {
        type: String,
        default: '',
        trim: true,
        validate: [validateZipCode, 'Put in a valid zip code (5 or 9 digits long)']
    },
    email: {
        type: String,
        default: '',
        trim: true
    },
    phone: {
        type: String,
        default: '',
        trim: true,
        validate: [validatePhoneNumber, 'Put in a valid phone number']
    },
    deleted_contact: {
        type: Boolean,
        default: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Contact', ContactSchema);
