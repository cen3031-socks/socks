'use strict';

/**
 * Module dependencies.
 */


var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Images Schema
 */

var ImageSchema = new Schema({
    
    deleted: {
        type: Boolean,  
        default: false
    },
    
	thumbNail: {
        type: String
	},

    created: {
		type: String
	},

    tags:{
        type: [{
            type: Schema.Types.ObjectId
        }],
    }
    
});

mongoose.model('Image', ImageSchema);