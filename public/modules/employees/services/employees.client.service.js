'use strict';

//Creates service used to communicate Creates REST endpoints
angular.module('employees').factory('Employees', ['$resource',
	function($resource) {
		return $resource('employees/:employeeId', { createId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);