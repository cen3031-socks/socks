'use strict';

angular.module('stats').controller('StatsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Employees', 'Cats'
	function($scope, $stateParams, $location, Authentication, Employees) {
		$scope.authentication = Authentication

	}
]);