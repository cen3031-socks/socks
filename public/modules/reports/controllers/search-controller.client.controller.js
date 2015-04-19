var app = angular.module('reports');

app.controller('CatSearchController', ['$scope', 'Cats', 'Reports', 'Dialogs', '$stateParams',
    function($scope, Cats, Reports, Dialogs, $stateParams) {


        $scope.possibleShots = possibleShots;
        $scope.searchResults = [];
        $scope.search = {
            filters: [],
            matchType: 'all',
            resultType: 'Cat'
        };

        if ($stateParams.reportId) {
            Reports.find($stateParams.reportId)
                .success(function(report) {
                    $scope.search = report;
                })
                .error(function(error) {
                    Dialogs.notify('Error', error.message);
                });
        }

        $scope.invertValues = [{value: false, text: 'Include only'}, {value: true, text: 'Exclude all'}];

        $scope.getResult = function() {
            Reports.resultOfImmediate($scope.search)
                .success(function(result) {
                    $scope.searchResults = result;
                })
                .error(function(error) {
                    Dialogs.notify('Error', error.message);
                });
        };

        $scope.saveDialog = function() {
            Dialogs.getText('Enter a name to save the report with.')
                .then(function(result) {
                    if (result) {
                        $scope.save(result);
                    }
                });
        };

        $scope.save = function(name) {
            $scope.search.name = name;
            if ($scope.search._id) {
                Reports.update($scope.search);
            } else {
                Reports.create($scope.search);
            }
        };

        $scope.export = function() {
            if ($scope.search._id) {
                window.location.href = '/reports/' + $scope.search._id + '/result.csv';
            } else {

            }
        };
    }]);
