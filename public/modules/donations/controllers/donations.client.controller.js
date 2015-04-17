'use strict';

// Donations controller
angular.module('donations').controller('DonationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Donations',
	function($scope, $stateParams, $location, Authentication, Donations) {
		$scope.authentication = Authentication;
		$scope.items=[{}];
        $scope.donations=[];

		// Create new Donation
		$scope.create = function() {
			// Create new Donation object
			var donation = new Donations ({
				//donor: this.contacts[0]._id,
                donor: $scope.donors[0]._id,                //this.donor?
                created: this.created,
                icon: $scope.icon,
                items: this.items
			});

            console.log('inside create');
			// Redirect after save
			donation.$save(function(response) {
				$location.path('donations/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.dollarAmount = '';
                $scope.donationType = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
                console.log($scope.error);
			});
		};

		//load more elements in donations infinte scroll
		$scope.loadMore = function() {
			var nextEnd = $scope.donations.length+10;
			for(var i=$scope.donations.length; i<nextEnd; i++)
			{
				$scope.donations.push($scope.allDonations[i])
			}
		}

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
			
			$scope.allDonations = Donations.query(function(){
				$scope.donations=[];
				$scope.loadMore();
			});
		};

		// Find existing Donation
		$scope.findOne = function() {
			$scope.donation = Donations.get({ 
				donationId: $stateParams.donationId
			});
		};

		//
		$scope.expandItems=function($thisDonation) {
			$thisDonation.isExpanded=!$thisDonation.isExpanded;
		};

		$scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    	};
	}
]);
