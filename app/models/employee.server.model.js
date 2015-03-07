'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Create Schema
 */
var EmployeeSchema = new Schema({
	firstName: {
		type: String,
		default: '',
		trim: true
	},
	lastName: {
		type: String,
		default: '',
		trim: true
	},
	email: {
		type: String,
		default: '',
		trim: true
	},
	phone: {
		type: String,
		default: '',
		trim: true
	},
	isAdmin: {
		type: Boolean
	},
	password: {
		type: String,
		default: ''
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	contact: {
		type: Schema.ObjectId,
		ref: 'Contact'
	}
});

mongoose.model('Employee', EmployeeSchema);