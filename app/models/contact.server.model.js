'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Contact Schema
 */
var ContactSchema = new Schema({
    firstName: {
        type: String,
        default: '',
        trim: true
    },
    surname: {
        type: String,
        default: '',
        trim: true
    },
    address: {
        type: String,
        default: '',
        trim: true
    },
    city: {
        type: String,
        default: '',
        trim: true
    },
    state: {
        type: String,
        default: '',
        trim: true
    },
    zipCode: {
        type: String,
        default: '',
        trim: true
    },
    email: {
        type: String,
        default: '',
        trim: true
    },
    phone: {
        type: String,
        default: '',
        trim: true
    },
    is_volunteer: {
        type: Boolean,
    },
    is_adopter: {
        type: Boolean,
    },
    is_fosterer: {
        type: Boolean,
    },
    is_donator: {
        type: Boolean,
    },
    is_vet: {
        type: Boolean,
    },
    is_employee: {
        type: Boolean,
    },
    is_admin: {
        type:  Boolean,
    },
    deleted_contact: {
        type: Boolean,
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Contact', ContactSchema);
