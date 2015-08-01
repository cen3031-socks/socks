'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema;

var VideoSchema = new Schema({
	path: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	tags: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Cat'
		}]
	}
});

mongoose.model('Video', VideoSchema);
