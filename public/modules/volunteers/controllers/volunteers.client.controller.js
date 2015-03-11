
'use strict';
// Volunteers controller
angular.module('volunteers').controller('VolunteersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Volunteers', '$modal', '$log' ,
    function($scope, $stateParams, $location, Authentication, Volunteers, $modal, $log) {
        $scope.authentication = Authentication;
        $scope.modalUpdate = function (size, selectedVolunteer) {
            $scope.selectedVolunteer = selectedVolunteer;
            var modalInstance = $modal.open({
                templateUrl: 'modules/volunteers/views/view-volunteer.client.view.html',
                controller: function ($scope, $modalInstance, volunteer) {
                    $scope.volunteer = volunteer;
                    $scope.name = selectedVolunteer.name;
                    $scope.currTime = new Date();
                } ,
                size: size,
                resolve: {
                    volunteer: function () {
                        return $scope.selectedVolunteer;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
// Create new Volunteer
        $scope.sign = function() {
            /*
             var vol = db.collection.findOne({name: this.name});
             //if the volunteer's name is not in the database create them
             if (vol == null) {
             var volunteer = new Volunteers({
             name: this.name,
             created: this.created,
             signedIn: this.signedIn,
             minutesVolunteeredInWee: this.minutesVolunteeredInWeek,
             minutesVolunteeredEver: this.minutesVolunteeredEver
             });
             }
             else {
             //var vol = volunteer with name just submitted
             if(vol.signedIn == false) {
             vol.mostRecentSignIn = new Date();
             vol.signedIn = true;
             }
             else {
             vol.signedIn = false;
             var cur = new Date();
             tmp = new Date(cur - vol.mostRecentSignIn);
             vol.minutesVolunteeredInWeek += tmp.getMinutes();
             }
             }
             // Redirect after save
             volunteer.$save(function(response) {
             // $location.path('volunteers/' + response._id);
             // Clear form fields
             $scope.name = '';
             }, function(errorResponse) {
             $scope.error = errorResponse.data.message;
             });
             */
//The code below does not funcition correctly. The code above that is commented out will eventually replace this once the above code gets debugged.
// Create new Volunteer object
            var volunteer = {
                name: this.name,
                timeIn: Date.now
            };
            $scope.modalUpdate('lg', volunteer);
// Redirect after save
//volunteer.$save(function(response) {
//$location.path('volunteers/' + response._id);
// Clear form fields
            $scope.name = '';
// }, function(errorResponse) {
// $scope.error = errorResponse.data.message;
//});
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
//open a modal window confirming that volunteer sign ins are correct
        this.modalConfirm = function (size, volunteerName) {
            var modalInstance = $modal.open({
                templateUrl: 'modules/volunteers/views/edit-volunteer.client.view.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
// Find existing Volunteer
        $scope.findOne = function() {
            $scope.volunteer = Volunteers.get({
                volunteerId: $stateParams.volunteerId
            });
        };
        $scope.date = new Date();
    }
]);

