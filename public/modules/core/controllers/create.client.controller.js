'use strict';

angular.module('core').controller('CreateController', [
	'$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	}
]);
