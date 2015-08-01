'use strict';

//Setting up route
angular.module('employees').config([
	'$stateProvider',
	function($stateProvider) {
		// Creates state routing
		$stateProvider.
			state('createEmployee', {
				url: '/employees/create',
				templateUrl: 'modules/employees/views/create-employee.client.view.html'
			}).
			state('viewEmployee', {
				url: '/employees/:employeeId',
				templateUrl: 'modules/employees/views/view-employee.client.view.html'
			}).
			state('editEmployee', {
				url: '/employees/:employeeId/edit',
				templateUrl: 'modules/employees/views/edit-employee.client.view.html'
			});
	}
]);
