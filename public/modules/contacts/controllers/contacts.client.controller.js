'use strict';
var contactsApp = angular.module('contacts');

contactsApp.controller('ContactsController', ['$scope', '$stateParams', 'Authentication', 'Contacts', '$modal', '$log', '$location', 'Dialogs',
    function($scope, $stateParams, Authentication, Contacts, $modal, $log, $location, Dialogs) {

        this.authentication = Authentication;
        $scope.getDetails = function(contact) {
            $location.path('contacts/' + contact._id);
        };

        $scope.find = function() {
            $scope.contacts = Contacts.query();
        };
        this.modalUpdate = function (size, selectedContact) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/contacts/views/edit-contacts.client.view.html',
                controller: function($scope, $modalInstance, contact){
                    $scope.contact = contact;
                },
                size: size,
                resolve: {
                    contact: function () {
                        return selectedContact;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.getMinutes = function(date1, date2) {
            minutesWorked()
        }
    }
]);

contactsApp.controller('ContactsCreateController', ['$scope', 'Contacts', '$location',
    function($scope, Contacts, $location) {
        // Create new Contact

        $scope.create = function() {
            // Create new Contact object
            var contact = new Contacts ({
                firstName: $scope.firstName,
                surname: $scope.surname,
                address: $scope.address,
                state: $scope.state,
                zipCode: $scope.zipCode,
                email: $scope.email,
                phone: $scope.phone,
                is_volunteer: $scope.is_volunteer,
                city: $scope.city
            });

            // Redirect after save
            contact.$save(function(response) {
                $location.path('contacts/' + response._id);

                // Clear form fields
                $scope.firstName = undefined;
                $scope.surname = undefined;
                $scope.address = undefined;
                $scope.state = undefined;
                $scope.zipCode = undefined;
                $scope.email = undefined;
                $scope.phone = undefined;
                $scope.is_volunteer = undefined;
                $scope.city = undefined;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                console.log(errorResponse);
            });
        };
    }
]);

contactsApp.controller('ContactsUpdateController', ['$scope', 'Contacts', '$stateParams', '$modal', 'Dialogs',
    function($scope, Contacts, $stateParams, $modal, Dialogs) {

    }
]);

contactsApp.controller('ContactsViewController', [ '$scope', 'Contacts', '$stateParams', '$modal', 'Authentication', '$location', 'Volunteers', 'Dialogs', '$log',
function ($scope, Contacts, $stateParams, $modal, Authentication, $location, Volunteers, Dialogs, $log) {

    $scope.isVolunteer = function () {
        var currDate = new Date();
        var oldDate = new Date();
        oldDate.setFullYear(2000);
        //If statement should call minutes worked from volunteers.server.controller.js
        var minutes_worked = Volunteers.minutesWorked({startDate: oldDate, endDate: currDate, contactId: $scope.contact._id}, function() {
            $scope.contact.hasVolunteered = (minutes_worked > 0);
        });
    };

    $scope.findOne = function () {
        $scope.contact = Contacts.get({
            contactId: $stateParams.contactId
        });
        var adoptions = Contacts.findAdoptedCats({contactId: $stateParams.contactId}, function() {
            $scope.contact.isAdopter = adoptions.length > 0;
        });
        var vets = Contacts.findCatsWithVets({contactId: $stateParams.contactId}, function() {
            $scope.contact.isVet = vets.length > 0;
        });
        var donations = Contacts.findDonations({contactId: $stateParams.contactId}, function() {
            $scope.contact.isDonator = donations.length > 0;
        });
    };

    $scope.formatPhoneNumber = function (phone) {
        if (!phone) return '';
        var newPhone = '';
        if (phone.length === 12) {
            newPhone += '+'+phone[0]+phone[1]+' ('+phone[2]+phone[3]+phone[4]+') '+phone[5]+phone[6]+phone[7]+
            '-'+phone[8]+phone[9]+phone[10]+phone[11];
        }
        else if (phone.length === 11) {
            newPhone += '+'+phone[0]+' ('+phone[1]+phone[2]+phone[3]+') '+phone[4]+phone[5]+phone[6]+
            '-'+phone[7]+phone[8]+phone[9]+phone[10];
        }
        else if (phone.length === 10) {
            newPhone += '('+phone[0]+phone[1]+phone[2]+') '+phone[3]+phone[4]+phone[5]+
            '-'+phone[8]+phone[7]+phone[8]+phone[9];
        }
        else {
            return;
        }
        return newPhone;
    };

    $scope.formatZipCode = function (zipCode) {
        if (!zipCode) return '';
        var newZipCode = '';
        if (zipCode.length === 5) {
            newZipCode += zipCode[0]+zipCode[1]+zipCode[2]+zipCode[3]+zipCode[4];
        }
        else if (zipCode.length === 9) {
            newZipCode += +zipCode[0]+zipCode[1]+zipCode[2]+zipCode[3]+zipCode[4]+
            '-'+zipCode[5]+zipCode[6]+zipCode[7]+zipCode[8];
        }
        else {
            return;
        }
        return newZipCode;
    };

    $scope.deleteNote = function(note, index) {
        Dialogs
            .confirm('Are you sure you want to delete this note?')
            .then(function(result) {
                if (result) {
                    Contacts.deleteNote({contactId: $scope.contact._id, noteId: note._id}, $scope.findOne);
                }
            });
    };

    $scope.canAddNote = function() {
        return $scope.authentication && $scope.authentication.user && $scope.authentication.user.contact && $scope.newNote !== '';
    };

    $scope.addNote = function() {
        if (!$scope.canAddNote()) return;
        Contacts.addNote({contactId: $scope.contact._id}, {
            message: $scope.newNote,
            date: Date.now(),
            sender: $scope.authentication.user.contact._id
        }, function() {
            $scope.findOne();
            $scope.newNote = '';
        });
    };

    // Open a modal window to Update a single contact record
    this.modalUpdate = function (size, selectedContact) {

        var modalInstance = $modal.open({
            templateUrl: 'modules/contacts/views/edit-contacts.client.view.html',
            controller: function($scope, $modalInstance, contact, Dialogs, $location){
                $scope.contact = contact;

                $scope.ok = function () {
                    if (document.updateContactForm.$valid){
                        $modalInstance.close($scope.contact);
                    }
                    $modalInstance.dismiss('cancel');
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.update = function(updatedContact) {
                    var contact = updatedContact;

                    contact.$update(function() {
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };
                $scope.deleteContact = function(contact, index) {
                    Dialogs
                        .confirm('Delete Contact?')
                        .then(function(result) {
                            if (result) {
                                contact.deleted_contact = true;
                                $scope.update(contact);
                                $modalInstance.dismiss('deleted');
                                $location.path('/contacts');
                            }
                        });
                };
                $scope.addToDoNotAdoptList = function(contact, index) {
                    Dialogs
                        .confirm('Add contact to the "Do not adopt" list?')
                        .then(function(result) {
                            if (result) {
                                contact.do_not_adopt = true;
                                $scope.update(contact);
                                $modalInstance.dismiss('Added to "Do not adopt" list');
                                // $location.path('/contacts');
                            }
                        });
                };
                $scope.removeFromDoNotAdoptList = function(contact, index) {
                    Dialogs
                        .confirm('Remove contact from the "Do not adopt" list?')
                        .then(function(result) {
                            if (result) {
                                contact.do_not_adopt = false;
                                $scope.update(contact);
                                $modalInstance.dismiss('Removed from "Do not adopt" list');
                                // $location.path('/contacts');
                            }
                        });
                };
            },
            size: size,
            resolve: {
                contact: function () {
                    return selectedContact;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    // Open a modal window to view a contact's adopted cats
    this.modalAdoptedCatsView = function (size, selectedContact) {

        var modalInstance = $modal.open({
            templateUrl: 'modules/contacts/views/adopted-cats.client.view.html',
            controller: function($scope, $modalInstance, contact){
                $scope.contact = contact;

                $scope.adoptions = Contacts.findAdoptedCats({contactId:contact._id});

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: size,
            resolve: {
                contact: function () {
                    return selectedContact;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    // Open a modal window to view a contact's donations
    this.modalDonationsView = function (size, selectedContact) {
        var modalInstance = $modal.open({
            templateUrl: 'modules/contacts/views/donations-per-contact.view.html',
            controller: function($scope, $modalInstance, contact){
                $scope.contact = contact;
                $scope.donations = Contacts.findDonations({contactId:contact._id});
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.linkToDonation = function(donation) {
                    $location.path('donations/' + donation._id);
                };
            },
            size: size,
            resolve: {
                contact: function () {
                    return selectedContact;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    // Open a modal window to view a contact's volunteer hours
    this.modalVolunteerHoursView = function (size, selectedContact) {

        var modalInstance = $modal.open({
            templateUrl: 'modules/contacts/views/volunteer-modal.client.view.html',
            controller: function($scope, $modalInstance, contact){
                $scope.contact = contact;

                $scope.volunteers = Contacts.findVolunteerHours({contactId:contact._id});

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: size,
            resolve: {
                contact: function () {
                    return selectedContact;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

contactsApp.directive('contactList', [function() {
    return {
        restrict: 'E',
        transclude: true,
        templateURL: 'modules/contacts/views/view-contacts.client.view.html',
        link: function(scope, element, attrs){

        }
    };
}]);
