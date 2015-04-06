'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Note = mongoose.model('Note'),
	_ = require('lodash');

exports.deleteNote = function(req, res) {
    Note.find({about: req.params.aboutId, _id: req.params.noteId})
        .remove()
        .exec(errorHandler.wrap(res, function() {
                res.json({message: 'Successfully deleted.'});
        }));
};

exports.addNote = function(req, res) {
    var note = new Note(req.body);
    note.about = req.params.aboutId;
    note.save(errorHandler.wrap(res, function(note) {
        console.log(note);
        res.jsonp(note);
    }));
};

exports.notesAboutId = function(req, res) {
    console.log(req.params.aboutId);
    Note.find({about: req.params.aboutId})
        .exec(errorHandler.wrap(res, function(notes) {
            res.jsonp(notes);
        }));
};
