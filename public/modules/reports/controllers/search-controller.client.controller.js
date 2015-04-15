var app = angular.module('reports');

app.controller('CatSearchController', ['$scope', 'Cats', '$http', 'Dialogs', function($scope, Cats, $http, Dialogs) {
    $scope.filters = [];
    $scope.searchResults = [];

    $scope.search = function() {
        $http.post('/search/cats', { filters: $scope.filters })
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
