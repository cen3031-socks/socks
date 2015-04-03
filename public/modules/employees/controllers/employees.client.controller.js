'use strict';

// Creates controller
angular.module('employees').controller('EmployeesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Employees',
	function($scope, $stateParams, $location, Authentication, Employees) {
		$scope.authentication = Authentication;

		// Create new Create
		$scope.create = function() {
			// Create new Create object
			var employee = new Employees ({
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.email,
				phone: this.phone,
				isAdmin: this.isAdmin,
				permissionLevel:this.permissionLevel,
				password: this.password
			});

			// Redirec after save
			employee.$save(function(response) {
				$location.path('/');

				// Clear form fields
				$scope.firstName = '';
				$scope.lastName = '';
				$scope.email = '';
				$scope.phone = '';
				$scope.isAdmin = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Create
		$scope.remove = function(employee) {
			if ( employee ) { 
				employee.$remove();

				for (var i in $scope.employees) {
					if ($scope.employees [i] === employee) {
						$scope.employees.splice(i, 1);
					}
				}
			} else {
				$scope.employee.$remove(function() {
					$location.path('employees');
				});
			}
		};

		// Update existing Create
		$scope.update = function() {
			var employee = $scope.employee;
			console.log(employee);
			employee.$update(function() {
				$location.path('employees/' + employee._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Creates
		$scope.find = function() {
			$scope.employees = Employees.query();
		};

		// Find existing Create
		$scope.findOne = function() {
			$scope.employee = Employees.get({ 
				employeeId: $stateParams.employeeId
			});
		};
	}
]);
