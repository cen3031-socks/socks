'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Cat Schema
 */
var CatSchema = new Schema({
	dateOfBirth: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Cat must have a name.'
	},
	/* Store sex in ISO/IEC 5218 format http://en.wikipedia.org/wiki/ISO/IEC_5218
	 *
	 * 0 - not known
	 * 1 - male
	 * 2 - female
	 * 9 - not applicable
	 */
	sex: {
		type: Number,
		default: 0
	},
	vet: String,
	dateOfArrival: {
		type: Date,
		default: Date.now 
	},
	breed: {
		type: String,
		default: 'Unknown',
		trim: true,
		required: 'Cats must have a breed.'
	},
	color: String,
	description: String,
	temperament: String,
	imageUrl: String,
	origin: {
		address: String,
		person: String
	},
	medicalRecords: {
		hasMicrochip: Boolean,
		procedures: [{date: Date, name: String, notes: String}]
	},
	currentLocation: String,
	owner: {
		type: String,
		default: '',
		trim: true
	},
	notes: [String]
});

mongoose.model('Cat', CatSchema);
