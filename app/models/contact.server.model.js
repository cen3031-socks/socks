'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema;

/**
 * A Validation function to make sure phone number is 10-12 digits long
 */
var validatePhoneNumber = function(phoneNumber) {
	return ( ( (phoneNumber.length >9) && (phoneNumber.length <13) ) || (phoneNumber.length === 0) );
};

/**
 * A Validation function to make sure phone number is 5 or 9 digits long
 */
var validateZipCode = function(zipCode) { 
	if (zipCode === '') {
		return true;
	}
	if ((zipCode.length === 0) || (zipCode.length === 5) || (zipCode.length === 9) ) {
		for(var i = 0; i < zipCode.length; i++){
			if (isNaN(zipCode.charAt(i))) {
				return false;
			}
		}
		return true;
	}
	return false;
};

/**
 * Ensures that the state variable will be a two letter code that matches to a real state
 */
var validateStateCode = function(state){
	if (state === ''){
		return true;
	}
	var stateCodes = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 
		'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 
	'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 
	'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];
	for(var i = 0; i < stateCodes.length; i++){
		if (state === stateCodes[i]){
			return true;
		}
	}
	return false;
};

var validateEmail= function(email){
	if(email === ''){
		return true;
	}
	var testresults = false;
	var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	if (filter.test(email)){
		testresults=true;
	}
	return testresults;
};


/**
 * Contact Schema
 */
var ContactSchema = new Schema({
	firstName: {
		type: String,
		default: '',
		trim: true,
		required: 'first Name is required'
	},
	surname: {
		type: String,
		default: '',
		trim: true,
		required: 'surname is required'
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
		trim: true,
		validate: [validateStateCode, 'Put a valid two character state code']
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
		trim: true,
		validate: [validateEmail, 'please enter a valid email']
	},
	phone: {
		type: String,
		default: '',
		trim: true,
		validate: [validatePhoneNumber, 'Put in a valid phone number']
	},
	do_not_adopt: {
		type: Boolean,
		default: false
	},
	deleted_contact: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Contact', ContactSchema);
