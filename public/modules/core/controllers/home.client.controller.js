'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Cats',
		function($scope, $location, Authentication, Cats) {
			$scope.authentication = Authentication;
			$scope.dateOfArrival = Date.now();

			$scope.getAge = function(cat) {
				if (cat.dateOfBirth === undefined) {
					return 'Unknown';
				}
				var dob = Date.parse(cat.dateOfBirth.toString());
				var value = (new Date() - dob) / (1000 * 60 * 60 * 24);
				if (value < 30) {
					return Math.round(value) + ' days';
				} else if (value / 30 < 24) {
					return Math.round(value/30) + ' months';
				} else return Math.round(value/365.25) + ' years';
			};

			$scope.cats = Cats.query();

			$scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				$scope.opened = true;
			};
			$scope.openArrival = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				$scope.arrivalDateOpened = true;
			};

			$scope.create = function() {
                var cat = new Cats({});
                cat.dateOfBirth = $scope.dateOfBirth;
                console.log(cat.dateOfBirthEstimated);
                cat.name = $scope.name;
                cat.vet = $scope.vet && $scope.vet.length === 1 ? $scope.vet[0]._id : undefined;
                cat.dateOfArrival = $scope.dateOfArrival;
                cat.breed = $scope.breed;
                cat.color = $scope.color;
                cat.description = $scope.description;
                cat.temperament = $scope.temperament;
                cat.origin = {
                    address: $scope.originAddress,
                    person: $scope.originPerson && $scope.originPerson.length === 1 ? $scope.originPerson[0]._id : undefined,
                    organization: $scope.originOrg
                },
                    cat.currentLocation = $scope.location;
                if ($scope.profileImage) {
                    cat.profileImage = $scope.profileImage._id;
                }
				return cat.$save(function(response) {
					$location.path('cats/' + response._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		}
]);
