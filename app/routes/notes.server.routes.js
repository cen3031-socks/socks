/**
 * Created by ahruss on 4/6/15.
 */
var notes = require('../../app/controllers/notes.server.controller');
var employees = require('../../app/controllers/employees.server.controller');
var users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {

	var requireEmployee = employees.permissionLevel(users.EMPLOYEE);

    app.route('/notes/:aboutId')
        .get(notes.notesAboutId)
        .post(requireEmployee, notes.addNote);

    app.route('/notes/:aboutId/:noteId')
        .delete(requireEmployee, notes.deleteNote);
};

