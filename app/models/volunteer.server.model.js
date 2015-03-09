'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Volunteer Schema
 */
var VolunteerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Volunteer name',
		trim: true
	},
    contact: {
        type: Schema.ObjectId,
        ref: 'User'
    },
	timeIn: {
		type: Date,
		default: Date.now
	},
    timeOut: {
        type: Date,
        default: null
    }
});

mongoose.model('Volunteer', VolunteerSchema);
