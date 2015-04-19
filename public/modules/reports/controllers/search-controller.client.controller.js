var app = angular.module('reports');

app.controller('CatSearchController', ['$scope', 'Cats', '$http', 'Dialogs', function($scope, Cats, $http, Dialogs) {
    $scope.possibleShots = possibleShots;
    $scope.filters = [];
    $scope.searchResults = [];
    $scope.matchType = 'all';
    $scope.invertValues = [{value: false, text: 'Include only'}, {value: true, text: 'Exclude all'}];

    $scope.search = function() {
        $http.post('/search/cats', { filters: $scope.filters, matchType: $scope.matchType })
            .success(function(result) {
                $scope.searchResults = result;
            })
            .error(function(error) {
                Dialogs.notify(error.message);
            })
    };

    $scope.save = function() {

    };

    $scope.export = function() {

    };
}]);
