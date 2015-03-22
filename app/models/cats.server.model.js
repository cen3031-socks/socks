'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AdoptionSchema = new Schema({
	adopter: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
	donation: { type: Schema.Types.ObjectId, ref: 'Donation' },
	date: Date,
	endDate: Date, 
	catId: { type: Schema.Types.ObjectId, ref: 'Cat' },
	returnReason: String
});

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
	hairLength: String,
	vet: { type: Schema.Types.ObjectId, ref: 'Contact' },
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
		person: { type: Schema.Types.ObjectId, ref: 'Contact' },
        notes: String
	},
	currentLocation: String,
	notes: [
        {
            message: String,
            date: Date,
            sender: { type: Schema.Types.ObjectId, ref: 'User' },
            _id: Schema.Types.ObjectId
        }
    ],
	events: [
		{
			_id: Schema.Types.ObjectId,
			detail: String,
			label: String,
			date: Date,
			/* for events that have a duration, like trips to vet */
			endDate: Date,
			eventType: String,
			icon: String
		}
	],
	adoptions: [{type: Schema.Types.ObjectId, ref: 'Adoption'}],
	currentAdoption: { type: Schema.Types.ObjectId, ref: 'Adoption' }
});

mongoose.model('Adoption', AdoptionSchema);
mongoose.model('Cat', CatSchema);

CatSchema.pre('save', function(next) {
	console.log(this);
	var i = 0;
	this.currentAdoption = undefined;
	for (i = 0; i < this.adoptions.length; ++i) {
		if (this.adoptions[i].endDate === undefined) {
			this.currentAdoption = this.adoptions[i];
			break;
		}
	}
	next();
});
