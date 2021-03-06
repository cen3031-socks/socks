'use strict';
var videos = angular.module('images');

videos.controller('VideoUploadController', [
	'$scope', '$http', '$location', '$upload',
	function($scope, $http, $location, $upload) {

		$scope.$watch('files', function () {
			$scope.upload($scope.files);
		});

		$scope.completedUploads = 0;
		$scope.failedUploads = [];
		$scope.uploads = [];
		$scope.upload = function(files) {
			if (files && files.length) {
				var upload = function(files, uploadIndex) {
					var file = files[uploadIndex];
					$scope.uploads.push({
						progress: undefined,
						filename: file.name
					});
					var oldCompleted = $scope.completedUploads || 0;
					$scope.completedUploads = 0;
					$scope.completedUploads = oldCompleted;
					$upload.upload({
						url: '/upload-video',
						fields: {},
						file: file
					}).progress(function (evt) {
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						$scope.uploads[uploadIndex].progress = progressPercentage;
						$scope.uploads[uploadIndex].status = 'default';
					}).success(function (data, status, headers, config) {
						$scope.uploads[uploadIndex].progress = 100;
						$scope.uploads[uploadIndex].status = 'success';
						$scope.completedUploads++;
					}).error(function(data, status, headers, config) {
						$scope.uploads[uploadIndex].status = 'danger';
						$scope.failedUploads.push($scope.uploads[uploadIndex]);
					});
				};
				for (var i = 0; i < files.length; ++i) {
					upload(files, i);
				}
			}
		};
	}]);
