'use strict';

// Volunteers controller
angular.module('volunteers').controller('VolunteersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Volunteers',
	function($scope, $stateParams, $location, Authentication, Volunteers) {
		$scope.authentication = Authentication;

		// Create new Volunteer
		$scope.create = function() {
			// Create new Volunteer object
			var volunteer = new Volunteers ({
				name: this.name
			});

			// Redirect after save
			volunteer.$save(function(response) {
				$location.path('volunteers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Volunteer
		$scope.remove = function(volunteer) {
			if ( volunteer ) { 
				volunteer.$remove();

				for (var i in $scope.volunteers) {
					if ($scope.volunteers [i] === volunteer) {
						$scope.volunteers.splice(i, 1);
					}
				}
			} else {
				$scope.volunteer.$remove(function() {
					$location.path('volunteers');
				});
			}
		};

		// Update existing Volunteer
		$scope.update = function() {
			var volunteer = $scope.volunteer;

			volunteer.$update(function() {
				$location.path('volunteers/' + volunteer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Volunteers
		$scope.find = function() {
			$scope.volunteers = Volunteers.query();
		};

		// Find existing Volunteer
		$scope.findOne = function() {
			$scope.volunteer = Volunteers.get({ 
				volunteerId: $stateParams.volunteerId
			});
		};
	}
]);