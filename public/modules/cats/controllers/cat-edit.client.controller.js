'use strict';
angular.module('core').controller('CatEditController',
    ['$scope', '$stateParams', 'Authentication', 'Cats', '$modal', '$location', '$rootScope', 'Contacts', 'Dialogs',
        function($scope, $stateParams, Authentication, Cats, $modal, $location, $rootScope, Contacts, Dialogs) {
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

            $scope.getCat = function() {
                var self = this;
                self.cat = Cats.get({catId: $stateParams.catId},
                    function() {
                        self.isFound = true;
                        for (var i in self.cat.adoptions) {
                            self.cat.adoptions[i].eventType = 'adoption';
                        }
                        self.cat.events = self.cat.events.concat(self.cat.adoptions);
                        var cat = self.cat;

                        self.dateOfBirth = cat.dateOfBirth;
                        self.dateOfBirthEstimated = cat.dateOfBirthEstimated;
                        self.name = cat.name;
                        self.sex = cat.sex;
                        self.vet = cat.vet ? [cat.vet] : [];
                        self.dateOfArrival = cat.dateOfArrival;
                        self.breed = cat.breed;
                        self.color = cat.color;
                        self.description = cat.description;
                        self.temperament = cat.temperament;
                        console.log(cat);
                        if (cat.origin) {
                            console.log(!!cat.origin.person);
                            self.originAddress = cat.origin.address;
                            self.originPerson = cat.origin.person ? [cat.origin.person] : [];
                            self.originOrg = cat.origin.organization;
                        }
                        self.location = cat.currentLocation;
                        console.log(self);
                    });

            };
            $scope.getCat();

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

            $scope.submit = function() {
                console.log(this);
                var cat = this.cat;
                cat.dateOfBirth = this.dateOfBirth;
                cat.dateOfBirthEstimated = this.dateOfBirthEstimated;
                cat.name = this.name;
                cat.sex = this.sex;
                cat.vet = this.vet && this.vet.length === 1 ? this.vet[0]._id : undefined;
                cat.dateOfArrival = this.dateOfArrival;
                cat.breed = this.breed;
                cat.color = this.color;
                cat.description = this.description;
                cat.temperament = this.temperament;
                cat.origin = {
                    address: this.originAddress,
                    person: this.originPerson && this.originPerson.length === 1 ? this.originPerson[0]._id : undefined,
                    organization: this.originOrg
                },
                cat.currentLocation = this.location;

                return this.cat.$save(function(response) {
                    $location.path('cats/' + response._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
        }]
);

