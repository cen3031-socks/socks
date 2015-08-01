'use strict';
angular.module('core').
	controller('CatVideoController', [
	'$scope', '$stateParams', 'Authentication', 'Cats', '$modal', '$location', '$rootScope', 'Contacts', 'Dialogs', '$sce',
	function($scope, $stateParams, Authentication, Cats, $modal, $location, $rootScope, Contacts, Dialogs, $sce) {
		$scope.$watch(
			function() {
				return $stateParams.videoId;
			}, function() {
				if ($stateParams.videoId) {
					$scope.source = $sce.trustAsResourceUrl('/videos/' + $stateParams.videoId + '/get');
				}
			});
	}]);

