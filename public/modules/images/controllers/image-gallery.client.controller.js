'use strict';
var images = angular.module('images');

images.controller('ImageGalleryPageController', [
	'$scope', 'Images', 'Dialogs', function($scope, Images, Dialogs) {
		$scope.selectMode = false;
		$scope.selectedImages = [];
		$scope.showAll = true;

		$scope.toggleSelect = function() {
			$scope.selectMode = !$scope.selectMode;
		};

		$scope.deleteSelected = function() {
			Dialogs.confirm('Are you sure you want to delete ' + $scope.selectedImages.length + ' images?').
				then(function(response) {
				if (response) {
					Images.deleteAll($scope.selectedImages).
						then(function(response) {
						$scope.selectedImages = [];
						$scope.showAll++;
					});
				}
			}, function(response) {
				Dialogs.notify('Error', 'Something went wrong: ' + response.data.message);
			});
		};
	}]);
