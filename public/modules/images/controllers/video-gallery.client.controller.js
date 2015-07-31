'use strict';
var images = angular.module('images');

images.controller('VideoGalleryPageController',
    ['$scope', 'Videos', 'Dialogs', function($scope, Videos, Dialogs) {
        $scope.selectMode = false;
        $scope.selectedVideos = [];

        $scope.toggleSelect = function() {
            $scope.selectMode = !$scope.selectMode;
        };

        $scope.deleteSelected = function() {
            Dialogs.confirm('Are you sure you want to delete ' + $scope.selectedVideos.length + ' videos?')
                .then(function(response) {
                    if (response) {
                        Videos.deleteAll($scope.selectedVideos).
                            then(function(response) {
                                console.log('got response from server');
                                window.location.reload();
                            });
                    }
                }, function(response) {
                    Dialogs.notify('Error', 'Something went wrong: ' + response.data.message);
                });
        };
    }]);
