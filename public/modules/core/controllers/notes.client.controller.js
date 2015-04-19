var core = angular.module('core');

core.directive('notes', function() {
    return {
        restrict: 'E',
        controller: 'NotesController',
        scope: { about: '=about' },
        templateUrl: '/modules/core/views/notes.client.directive.html',
        link: function(scope, element, attrs, ctrl) { }
    };
});

core.controller('NotesController', ['$scope', 'Notes', 'Dialogs', 'Authentication',
    function($scope, Notes, Dialogs, Authentication) {

        $scope.authentication = Authentication;

        $scope.deleteNote = function(note) {
            Dialogs
                .confirm('Are you sure you want to delete this note?')
                .then(function(result) {
                    if (result) {
                        Notes.deleteNote({aboutId: $scope.about, noteId: note._id}, $scope.getNotes);
                    }
                });
        };

        $scope.getNotes = function() {
            $scope.notes = Notes.getAboutId({aboutId: $scope.about}, function(res) { console.log(res); }, function(res) { console.log(res); });
        };

        $scope.canAddNote = function() {
            return $scope.authentication && $scope.authentication.user && $scope.authentication.user.contact && $scope.newNote != '';
        };

        $scope.addNote = function() {
            if (!$scope.canAddNote()) return;
            Notes.create({aboutId: $scope.about}, {
                message: $scope.newNote,
                date: Date.now(),
                sender: $scope.authentication.user.contact
            }, function() {
                $scope.getNotes();
                $scope.newNote = '';
            });
        };

        $scope.$watch(function() { return $scope.about; }, $scope.getNotes);
    }]);
