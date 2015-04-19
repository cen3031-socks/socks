var reports = angular.module('reports');
reports.controller('ExportIndexController',
    ['$scope', 'Dialogs', 'Reports',
        function($scope, Dialogs, Reports) {

            Reports.list()
                .success(function(reports) {
                    $scope.searches = reports;
                });
        }
    ]);
