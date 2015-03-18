'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Cats',
		function($scope, $location, Authentication, Cats) {
			// This provides Authentication context.
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
                if (this.originPerson.length !== 1) {
                    $scope.error = "You must select an origin person";
                }
				var cat = new Cats({
					dateOfBirth: this.dateOfBirth,
					name: this.name,	
					sex: this.sex,
					vet: this.vet._id,
					dateOfArrival: this.dateOfArrival,
					breed: this.breed,
					color: this.color,
					description: this.description,
					temperament: this.temperament,
					origin: {
						address: this.originAddress,
						person: this.originPerson[0]._id
					},
					currentLocation: this.location,
					owner: this.owner,
					notes: [this.notes]
				});
				return cat.$save(function(response) {
					$location.path('cats/' + response._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		}
]);
