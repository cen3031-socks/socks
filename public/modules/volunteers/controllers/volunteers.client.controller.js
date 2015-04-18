
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
                    $scope.contact = volunteer.contact;
                    $scope.currTime = new Date();
                    setTimeout($modalInstance.dismiss, 4000);
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



            var correctVolunteer = Volunteers.getByName({contactId:$scope.contact[0]._id}, function(){
                console.log(correctVolunteer);

                if (correctVolunteer.length === 0) {
                    console.log('Creating new volunteer session');
                    //create new volunteer
                    var volunteer = new Volunteers( {
                        contact: $scope.contact[0]._id,
                        timeIn: Date.now()
                    });
                    volunteer.$save(function(response) {
                        $scope.contact = [];
                        $scope.modalUpdate('lg', volunteer);
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                        //console.log(errorResponse);
                    });
                } else {

                    console.log('Ending existing volunteer session');
                    //you probably can't do this
                    correctVolunteer[0].timeOut = Date.now();
                    correctVolunteer[0].$update(function(response) {

                        $scope.modalUpdate('lg', correctVolunteer[0]);
                        $scope.contact = [];


                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                        //console.log(errorResponse);
                    });
                }



                //$scope.name = '';





            });



// Redirect after save
//volunteer.$save(function(response) {
//$location.path('volunteers/' + response._id);
// Clear form fields
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

