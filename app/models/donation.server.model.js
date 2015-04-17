'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var validateItemName = function(name) {
    var possible = ['Food', 'Monetary', 'Supplies'];
    var inList = false;
    for (var i = 0; possible.length; i++) {
        if (possible[i] === name){
            inList = true;
        }
    }
    return inList;
};

var amountAndUnitsChecker = function(items) {
    if (items === null) {
        return true;
    }
    if ((items.amount === null && items.units === null) || (items.amount !== null && items.units !== null)) {
        return true;
    }
    else {
        return false;
    }
};
var oneItemPresent = function(items){
    if (items.length >= 1) {
        return true;
    } else {
        return false;
    }
};

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
		default: Date.now,
        required: 'must have a date'
	},

 /*   totalAmount: {                //an automatic statistic that gets calculated and appears
        type: Number,               //at the bottom of the receipt-like donation view
        default: null,
        trim: true,
        units: String
    },*/

    items:{
        type: [{
            name: {
                type: String,
                required: 'name must be present',
                validate: [validateItemName, 'not a valid item name']
            },                                              //food/monetary/cleaning supplies/etc..    
            _id: Schema.Types.ObjectId,                                 //an id to delete/edit later
            icon: String,                                                //icon representing type
            description: String,
            value: {
                type: {amount: Number, units: String},
                validate: [amountAndUnitsChecker, 'if amount is present units must be present']
            }
        }],
        validate: [oneItemPresent, 'must have one item present in list']
    }
    
});

mongoose.model('Donation', DonationSchema);
