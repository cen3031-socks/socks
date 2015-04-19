'use strict';

var possibleShots = [
    'FVRCP-1',
    'FVRCP-2',
    'FVRCP-3',
    'Worm',
    'FIP-1',
    'FIP-2',
    'Rabies',
    'Rabies Booster'
];

var adoptionController = function(cat, Cats, $scope, $modalInstance) {
    $scope.adoptCat = function() {
        Cats.adopt({catId: cat._id}, {
            adopter: $scope.adopter[0]._id,
            donation: $scope.donationId,
            date: $scope.adoptionDate,
            adoptionType: $scope.adoptionType
        }, function() {
            $modalInstance.close(true);
        });
    };
    $scope.unadoptCat = function() {
        Cats.unadopt({catId: cat._id, adoptionId: cat.currentAdoption._id}, {
            endDate: $scope.returnDate,
            reason: $scope.reason
        }, function() {
            $modalInstance.close(true);
        });
    };
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
};

angular.module('core').controller('CatViewController',
    ['$scope', '$stateParams', 'Authentication', 'Cats', '$modal', '$location', '$rootScope', 'Contacts', 'Dialogs',
        function($scope, $stateParams, Authentication, Cats, $modal, $location, $rootScope, Contacts, Dialogs) {
            // This provides Authentication context.
            $scope.authentication = Authentication;
            $scope.possibleShots = possibleShots;

            $scope.eventLimit = 3;
            $scope.showMore = function() {
                $scope.eventLimit += 5;
            };
            $scope.isFound = false;

            $scope.getCat = function() {
                $scope.cat = Cats.get({catId: $stateParams.catId},
                    function() {
                        $scope.isFound = true;
                        for (var i in $scope.cat.adoptions) {
                            $scope.cat.adoptions[i].eventType = 'adoption';
                        }
                        $scope.cat.events = $scope.cat.events.concat($scope.cat.adoptions);
                        console.log($scope.cat);
                    });
            };

            $scope.getCat();

            $scope.unadopt = function() {
                $modal.open({
                    templateUrl: '/modules/cats/views/unadopt-cat.client.modal.html',
                    controller: adoptionController,
                    resolve: {
                        cat: function() {
                            return $scope.cat;
                        }
                    }
                }).result.then(function() {
                        $scope.getCat();
                    });
            };

            $scope.adopt = function() {
                $modal.open({
                    templateUrl: '/modules/cats/views/adopt-cat.client.modal.html',
                    controller: adoptionController,
                    resolve: {
                        cat: function() {
                            return $scope.cat;
                        }
                    }
                }).result.then(function() {
                        $scope.getCat();
                    });
            };

            $scope.addEvent = function() {
                $modal.open({
                    templateUrl: '/modules/cats/views/add-event.client.modal.html',
                    controller: function(cat, Cats, $scope, $modalInstance) {
                        $scope.possibleShots = possibleShots;
                        $scope.operations = [];
                        $scope.getIcon = function() {
                            return 'glyphicon-pushpin';
                        };
                        $scope.createEvent = function() {
                            Cats.addEvent({catId: cat._id}, {
                                eventType: $scope.eventType,
                                detail: $scope.detail,
                                label: $scope.label,
                                date: $scope.date,
                                icon: $scope.getIcon(),
                                data: {
                                    operations: this.operations
                                }
                            }, function() {
                                $modalInstance.close(true);
                            });
                        };
                    },
                    resolve: {
                        cat: function() {
                            return $scope.cat;
                        }
                    }
                }).result.then(function() {
                        $scope.getCat();
                    });
            };

            $scope.onRouteChangeOff = $scope.$on('$locationChangeStart', function(event, newState, oldState) {
                if (($scope.newNote || '') !== '') {
                    Dialogs
                        .confirm('You have unsaved data entered on this page. Do you want to leave without saving?')
                        .then(function(result) {
                            if (result) {
                                $scope.onRouteChangeOff();
                                $location.path(newState);
                            }
                        });
                    event.preventDefault();
                }
            });

            $scope.deleteEvent = function(event) {
                Dialogs
                    .confirm('Are you sure you want to delete this event?')
                    .then(function(result) {
                        if (result) {
                            Cats.deleteEvent({catId: $scope.cat._id, eventId: event._id}, $scope.getCat);
                        }
                    });
            };

            $scope.contacts = Contacts.query();

            $scope.convertSex = function(sexNumber) {
                if (sexNumber === 0) {
                    return 'Unknown';
                }
                else if (sexNumber === 1) {
                    return 'Male';
                }
                else if (sexNumber === 2) {
                    return 'Female';
                }
                else if (sexNumber === 9) {
                    return 'N/A';
                }
            };

            $scope.getSpayDate = function(cat) {
                if (cat.events === undefined) return;
                for (var i = 0; i < cat.events.length; ++i) {
                    var thisEvent = cat.events[i];
                    if (thisEvent && thisEvent.eventType === 'vet') {
                        var operations = thisEvent.data.operations;
                        for (var j = 0; j < operations.length; ++j) {
                            if (operations[j].type === 'Spay/Neuter') {
                                return thisEvent.date;
                            }
                        }
                    }
                }
            };

            $scope.getProcedureDates = function(cat, type) {
                var dates = [];
                if (cat.events) {
                    for (var i = 0; i < cat.events.length; ++i) {
                        var thisEvent = cat.events[i];
                        if (thisEvent && thisEvent.eventType === 'vet') {
                            var operations = thisEvent.data.operations;
                            for (var j = 0; j < operations.length; ++j) {
                                if (operations[j].type === type) {
                                    dates.push(thisEvent.date);
                                    break;
                                }
                            }
                        }
                    }
                }
                return dates;
            }

            $scope.edit = function() {
                $location.path('/cats/' + $scope.cat._id + '/edit');
            };

        }]
);

