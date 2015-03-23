'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Donation Schema
 */
var DonationSchema = new Schema({
	donor: {
		type: Schema.Types.ObjectId,
        ref: 'Contact', 
		required: 'Please fill select or make a new contact.'
	},

    created: {
		type: Date,
		default: Date.now
	},

    dollarAmount: {
        type: Number,
        default: 0.0,
        trim: true
    },

    paymentType: {
        type: String,
        default: '',
        trim: true
    }
});

mongoose.model('Donation', DonationSchema);
