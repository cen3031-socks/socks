'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Cats',
		function($scope, $location, Authentication, Cats) {
			// This provides Authentication context.
			$scope.authentication = Authentication;

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

			$scope.create = function() {
				var cat = new Cats({
					dateOfBirth: this.dob,
					name: this.name,	
					sex: this.sex,
					vet: this.vet,
					dateOfArrival: this.dateOfArrival,
					breed: this.breed,
					color: this.color,
					description: this.description,
					temperament: this.temperament,
					origin: {
						address: this.originAddress,
						person: this.originPerson
					},
					currentLocation: this.location,
					owner: this.owner,
					notes: [this.notes]
				});
				cat.$save(function(response) {
					$location.path('cats/' + response._id);
					 this.dob = undefined;
					 this.name = undefined;
					 this.sex = undefined;
					 this.vet = undefined;
					 this.dateOfArrival = undefined;
					 this.breed = undefined;
					 this.color = undefined;
					 this.description = undefined;
					 this.temperament = undefined;
					 this.originAddress = undefined;
					 this.originPerson = undefined;
					 this.location = undefined;
					 this.owner = undefined;
					 this.notes = undefined;
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};
		}
]);
