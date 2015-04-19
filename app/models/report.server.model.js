'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ReportSchema = new Schema({

    /**
     * The type of search we're doing:
     *
     *      all     match all of the filters
     *      any     match at least one of the filters
     *      none    match exactly zero of the filters
     */
    matchType: {
        type: String,
        enum: ['all', 'any', 'none']
    },

    /**
     * Stores arbitrary filter-specific data.
     */
    filters: [{}],

    /**
     * The collection this report searches for.
     */
    resultType: {
        type: String,
        enum: ['Cat', 'Volunteer', 'Donation', 'Contact']
    },

    name: {
        type: String,
        required: 'Report must have a name'
    }

});

mongoose.model('Report', ReportSchema);
