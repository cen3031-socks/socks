'use strict';

// Creates controller
angular.module('creates').controller('CreatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Creates',
	function($scope, $stateParams, $location, Authentication, Creates) {
		$scope.authentication = Authentication;

		// Create new Create
		$scope.create = function() {
			// Create new Create object
			var create = new Creates ({
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.email,
				phone: this.phone,
				isAdmin: this.isAdmin,
				password: this.password
			});

			// Redirect after save
			create.$save(function(response) {
				$location.path('creates/' + response._id);

				// Clear form fields
				$scope.firstName = '';
				$scope.lastName = '';
				$scope.email = '';
				$scope.phone = '';
				$scope.isAdmin = '';

			}, function(errorResponse) {
				alert(JSON.stringify(errorResponse));
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Create
		$scope.remove = function(create) {
			if ( create ) { 
				create.$remove();

				for (var i in $scope.creates) {
					if ($scope.creates [i] === create) {
						$scope.creates.splice(i, 1);
					}
				}
			} else {
				$scope.create.$remove(function() {
					$location.path('creates');
				});
			}
		};

		// Update existing Create
		$scope.update = function() {
			var create = $scope.create;

			create.$update(function() {
				$location.path('creates/' + create._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Creates
		$scope.find = function() {
			$scope.creates = Creates.query();
		};

		// Find existing Create
		$scope.findOne = function() {
			$scope.create = Creates.get({ 
				createId: $stateParams.createId
			});
		};
	}
]);