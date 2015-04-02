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

 /*   totalAmount: {                //an automatic statistic that gets calculated and appears
        type: Number,               //at the bottom of the receipt-like donation view
        default: null,
        trim: true,
        units: String
    },*/

    items: [
        {
            type: String,                                               //food/monetary/cleaning supplies/etc..      
            _id: Schema.Types.ObjectId,                                 //an id to delete/edit later
            icon: String,                                                //icon representing type
            description: String,
            value: {
                type: Number,
                default: null,
                trim: true,
                units: String
            }
        }
    ]

    /*paymentType: {
        type: String,
        default: '',
        trim: true
    },*/


});

mongoose.model('Donation', DonationSchema);
