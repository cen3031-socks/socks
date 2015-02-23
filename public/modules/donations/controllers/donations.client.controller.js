'use strict';

// Donations controller
angular.module('donations').controller('DonationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Donations',
	function($scope, $stateParams, $location, Authentication, Donations) {
		$scope.authentication = Authentication;

		// Create new Donation
		$scope.create = function() {
			// Create new Donation object
			var donation = new Donations ({
				name: this.name,
                dollarAmount: this.dollarAmount,
                donationType: this.donationType
			});

			// Redirect after save
			donation.$save(function(response) {
				$location.path('donations/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.dollarAmount = '';
                $scope.donationType = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Donation
		$scope.remove = function(donation) {
			if ( donation ) { 
				donation.$remove();

				for (var i in $scope.donations) {
					if ($scope.donations [i] === donation) {
						$scope.donations.splice(i, 1);
					}
				}
			} else {
				$scope.donation.$remove(function() {
					$location.path('donations');
				});
			}
		};

		// Update existing Donation
		$scope.update = function() {
			var donation = $scope.donation;

			donation.$update(function() {
				$location.path('donations/' + donation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Donations
		$scope.find = function() {
			$scope.donations = Donations.query();
		};

		// Find existing Donation
		$scope.findOne = function() {
			$scope.donation = Donations.get({ 
				donationId: $stateParams.donationId
			});
		};
	}
]);
