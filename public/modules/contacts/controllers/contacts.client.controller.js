'use strict';

// Contacts controller

var contactsApp = angular.module('contacts');

contactsApp.controller('ContactsController', ['$scope', '$stateParams', 'Authentication', 'Contacts', '$modal', '$log',
    function($scope, $stateParams, Authentication, Contacts, $modal, $log) {

        this.authentication = Authentication;

        //$scope.linkToContact =  function(selectedContact,  $location){
        //    $location.path('contacts/' + response._id);
        //}

        //find a list of Contacts
        this.contacts = Contacts.query();

        // Open a modal window to Update a single Contact record
        this.modalUpdate = function (size, selectedContact) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/contacts/views/edit-Contact.client.view.html',
                controller: function($scope, $modalInstance, Contact){
                    $scope.Contact = Contact;

                    $scope.ok = function () {

                        if (updateContactForm.$valid){
                            $modalInstance.close($scope.Contact);
                        }
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    Contact: function () {
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
    }
]);

contactsApp.controller('ContactsCreateController', ['$scope', 'Contacts', '$location',
    function($scope, Contacts, $location) {
        // Create new Contact

        $scope.create = function() {
            // Create new Contacts object
            var Contact = new Contacts ({
                firstName: this.firstName,
                surname: this.surname,
                address: this.address,
                state: this.state,
                zipCode: this.zipCode,
                email: this.email,
                phone: this.phone,
                volunteer: this.volunteer,
                city: this.city
            });

            // Redirect after save
            Contact.$save(function(response) {
                $location.path('contacts/' + response._id);

                // Clear form fields
                $scope.firstName = '';
                $scope.surName = '';
                $scope.address = '';
                $scope.state = '';
                $scope.zipCode = '';
                $scope.email = '';
                $scope.phone = '';
                $scope.volunteer = '';
                $scope.city = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                console.log(errorResponse);
            });
        };
    }
]);

contactsApp.controller('ContactsUpdateController', ['$scope', 'Contacts',
    function($scope, Contacts) {

        // Update existing Contact
        this.update = function(updatedContact) {
            var Contact = updatedContact;

            Contact.$update(function() {
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    }
]);

contactsApp.controller('ContactsViewController', [ '$scope', 'Contacts', '$stateParams',
    function ($scope, Contacts, $stateParams) {
        // Find existing Contact
        $scope.findOne = function () {
            $scope.Contact = Contacts.get({
                ContactId: $stateParams.ContactId

            });
            console.log($scope.Contact);
        };

    }]);
contactsApp.directive('contactList', [function() {
    return {
        restrict: 'E',
        transclude: true,
        templateURL: 'modules/contacts/views/view-Contact.client.view.html',
        link: function(scope, element, attrs){

        }
    };


}]);

//// Create new Contact
//$scope.create = function() {
//	// Create new Contact object
//	var Contact = new contacts ({
//       firstName: this.firstName,
//		surName: this.surName,
//       address: this.address,
//       state: this.state,
//       zipCode: this.zipCode,
//       email: this.email,
//       phone: this.phone,
//       volunteer: this.volunteer,
//       city: this.city
//	});
//
//	// Redirect after save
//	Contact.$save(function(response) {
//		$location.path('contacts/' + response._id);
//
//		// Clear form fields
//       $scope.firstName = '';
//       $scope.surName = '';
//       $scope.address = '';
//       $scope.state = '';
//       $scope.zipCode = '';
//       $scope.email = '';
//       $scope.phone = '';
//       $scope.volunteer = '';
//       $scope.city = '';
//   }, function(errorResponse) {
//		$scope.error = errorResponse.data.message;
//	});
//};

//// Remove existing Contact
//$scope.remove = function(Contact) {
//	if ( Contact ) { Contact.$remove();
//
//		for (var i in $scope.contacts) {
//			if ($scope.contacts [i] === Contact) {
//				$scope.contacts.splice(i, 1);
//			}
//		}
//	} else {
//		$scope.Contact.$remove(function() {
//			$location.path('contacts');
//		});
//	}
//};
//
//// Update existing Contact
//$scope.update = function() {
//	var Contact = $scope.Contact;
//
//	Contact.$update(function() {
//		$location.path('contacts/' + Contact._id);
//	}, function(errorResponse) {
//		$scope.error = errorResponse.data.message;
//	});
//};
//
//// Find existing Contact
//$scope.findOne = function() {
//	$scope.Contact = contacts.get({
//		ContactId: $stateParams.ContactId
//	});
//};
