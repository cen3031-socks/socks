'use strict';
var videos = angular.module('images');

videos.controller('VideoGalleryController', [
	'$scope', 'Videos', '$location',
	function($scope, Videos, $location) {
		$scope.selectedVideos = $scope.selectedVideos || [];

		$scope.$watch('showAll', function() {
			if ($scope.showAll) {
				Videos.list().then(function (response) {
					$scope.videos = response.data;
					$scope.addSources();
				});
			}
		});

		$scope.videoClicked = function(video) {
			if ($scope.selectMode) {
				var index = $scope.selectedVideos.indexOf(video);
				if (index === -1) {
					$scope.selectedVideos.push(video);
					video.selected = true;
				} else {
					$scope.selectedVideos.splice(index, 1);
					video.selected = false;
				}
			} else {
				$location.path('/videos/' + video._id);
			}
			console.log($scope.selectedVideos);
		};

		$scope.$watch('selectMode', function() {
			if (!$scope.selectMode) {
				for (var i = 0; i < $scope.selectedVideos.length; ++i) {
					$scope.selectedVideos[i].selected = false;
				}
				$scope.selectedVideos = [];
				if ($scope.selectedVideo) {
					$scope.selectedVideo.selected = false;
					$scope.selectedVideo = undefined;
				}
			}
		});
	}
]);

videos.directive('videoGallery', [
	function() {
		return {
			restrict: 'E',
			controller: 'VideoGalleryController',
			scope: {
				max: '=?max',
				selectMode: '=?selectMode',
				selectedVideos: '=?selectedVideos',
				showAll: '=?showAll'
			},
			templateUrl: '/modules/images/views/video-gallery.client.directive.html',
			link: function(scope, element, attrs, ctrl) { }
		};
	}]);
