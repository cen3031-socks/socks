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
	created: {
		type: Date,
		default: Date.now
	},
    signedIn: {
        type: Boolean
    },
    mostRecentSignIn: {
        type: Date
    },
    minutesVolunteeredInWeek: {
        type: Number,
        default: '0'
    },
    minutesVolunteeredEver: {
        type: Number,
        default: '0'
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Volunteer', VolunteerSchema);
