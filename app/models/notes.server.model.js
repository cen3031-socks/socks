'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var NoteSchema = new Schema({
    about:  {
        type: Schema.Types.ObjectId,
        required: 'Notes must be about something.'
    },
    message: {
        type: String,
        required: 'message must not be empty'
    },
    date: {
        type:Date,
        default: Date.now,
        required: 'date is required'
    },
    sender: { 
        type: Schema.Types.ObjectId,  
        ref: 'User',
        required: 'needs user'
    }
});

mongoose.model('Note', NoteSchema);

