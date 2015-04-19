'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ImageSchema = new Schema({
    deleted: {
        type: Boolean,  
        default: false
    },
	thumbnail: {
        type: String
	},
    large: {
        type: String
    },
    original: {
        type: String
    },
    created: {
		type: Date,
        default: Date.now
	},
    tags: {
        type: [{
            type: Schema.Types.ObjectId
        }]
    }
});

mongoose.model('Image', ImageSchema);
