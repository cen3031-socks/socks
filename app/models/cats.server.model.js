'use strict';
var breeds = require('../../petfinder-breed-list.js');
var Icons = require('../../glyphicon-list.js');
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AdoptionSchema = new Schema({
	adopter: { type: Schema.Types.ObjectId, ref: 'Contact', required: true },
	donation: { type: Schema.Types.ObjectId, ref: 'Donation' },
	date: {
		type: Date,
		default: Date.now,
		required: 'must have adoption date'
	},
	endDate: Date, 
	catId: { type: Schema.Types.ObjectId, ref: 'Cat', required: 'must adopt a cat' },
	returnReason: String,
    adoptionType: {
        type: String,
        enum: ['adoption', 'foster']
    }
});

var validateSex = function(sex){
	if(sex == 1 || sex == 2 || sex == 9 || sex == 0){
		return true;
	}
	return false;
}
/*

legacy validate
var validateBreed = function(breed){
	for(int i = 0; i < breeds.list.length; i++){
		if(breed == breeds.list[i]){
			return true;
		}
	} 
	return false;
}*/
/**
 * Cat Schema
 */
var CatSchema = new Schema({
	dateOfBirth: {
		type: Date,
		default: Date.now
	},
    dateOfBirthEstimated: {
        type: Boolean,
        default: true
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
		default: 0,
		validate: [validateSex, 'Must have a valid sex']
	},
	hairLength: String,
	vet: { type: Schema.Types.ObjectId, ref: 'Contact' },
	dateOfArrival: {
		type: Date,
		default: Date.now,
		required: 'must have an arrival date' 
	},
    dateOfDeceased: {
        type: Date
    },
	breed: {
		type: String,
		trim: true,
		required: 'Cats must have a breed.',
		enum: breeds.list
	},
	color: String,
	description: String,
	temperament: String,
	profileImage: { type: Schema.Types.ObjectId, ref: 'Image' },
	origin: {
		address: String,
		person: { type: Schema.Types.ObjectId, ref: 'Contact' },
        organization: String,
        notes: String
	},
	currentLocation: String,
	events: [
		{
			_id: Schema.Types.ObjectId,
			detail: String,
			label: {
				type: String,
				required: 'Event must have a label'
			},
			date: {
				type: Date,
				required: 'Event must have a date'
			},
			/* for events that have a duration, like trips to vet */
			endDate: Date,
			eventType: {
				type: String,
				required: 'Event must have a event type'
			},
			icon: {
				type: String,
				enum: Icons.list
			},
            data: {}
		}
	],
	adoptions: [{type: Schema.Types.ObjectId, ref: 'Adoption'}],
	currentAdoption: { type: Schema.Types.ObjectId, ref: 'Adoption' }
});

mongoose.model('Adoption', AdoptionSchema);
mongoose.model('Cat', CatSchema);

CatSchema.pre('save', function(next) {
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
