/**
 * Created by ahruss on 4/6/15.
 */
var notes = require('../../app/controllers/notes.server.controller');

module.exports = function(app) {
    app.route('/notes/:aboutId')
        .get(notes.notesAboutId)
        .post(notes.addNote);

    app.route('/notes/:aboutId/:noteId')
        .delete(notes.deleteNote);
};

