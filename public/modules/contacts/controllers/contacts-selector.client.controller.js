'use strict';

var contacts = angular.module('contacts');
contacts.controller('ContactsSelectorController', ['$stateParams', 'Contacts', '$modal', '$scope', '$rootScope',
    function($stateParams, Contacts, $modal, $scope, $rootScope) {
        $scope.selectedContacts = [];

        $scope.showModal = function() {
            if ($scope.max === undefined) {
                $scope.max = -1;
            }

            // if we've already got enough contacts selected, don't show the modal.
            if ($scope.selectedContacts.length >= $scope.max && $scope.max != -1) {
                return;
            }

            // set the parameters used inside the modal
            var modalScope = $rootScope.$new();
            modalScope.title = $scope.title || 'Find a Contact';
            modalScope.hideUntil = $scope.hideUntil || 3;

            var modalInstance = $modal.open({
                scope: modalScope,
                templateUrl: '/modules/contacts/views/select-contact-list.client.template.html',
                controller: function($scope, $modalInstance, Contacts, $modal) {
                    $scope.contacts = Contacts.query();
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.select = function(contact) {
                        $modalInstance.close(contact);
                    }
                    $scope.createContact = function() {
                        var createModal = $modal.open({
                            templateUrl: '/modules/contacts/views/create-contacts.client.view.html',
                            size: 'lg',
                            controller: ''
                        });
                        // stop route changes to /contacts/:contactId so the create-contact view doesn't take you
                        // off the page.
                        var onRouteChangeOff = $scope.$on('$locationChangeStart', function(event, newState, oldState) {
                            if (newState.match(/\/contacts\/[\w\d]{24}$/)) {
                                onRouteChangeOff();
                                createModal.dismiss();
                                $modalInstance.close(Contacts.get({contactId: newState.match(/[\w\d]{24}$/)}));
                                event.preventDefault();
                            }
                        });
                    };
                },
                size: 'md'
            });
            modalInstance.result.then($scope.select);
        };

        $scope.select = function(contact) {
            if ($scope.selectedContacts.indexOf(contact) !== -1) {
                $scope.selectedContacts.splice($scope.selectedContacts.indexOf(contact), 1);
            }
            $scope.selectedContacts.push(contact);
        };

        $scope.unselect = function(contact, index) {
            $scope.selectedContacts.splice(index, 1);
        };
    }]);
/**
 * Creates a directive contacts-selector, which acts like a form input.
 * It allows the user to select a number of contacts. Sets its ng-model
 * to be an array of the selected contacts
 *
 * Attributes:
 *      max         the maximum allowable number of contacts
 *      title       the text to show at the top of the selector
 *      hide-until  the number of characters to require to be typed before showing any contacts in the list
 */
contacts.directive('contactsSelector', function() {
    return {
        restrict: 'E',
        controller: 'ContactsSelectorController',
        scope: { maxContacts: '=max', selectedContacts: '=?ngModel', title: '=?title', hideUntil: '=?hideUntil' },
        templateUrl: '/modules/contacts/views/contact-selector.client.template.html',
        link: function(scope, element, attrs, ctrl) { }
    };
});

/**
 * Creates a directive contact-link that makes it easy to make a link to a contact from a
 * contact id.
 */
contacts.directive('contactLink', ['Contacts', function(Contacts) {
    return {
        restrict: 'E',
        controller: 'ContactLinkController',

        template: '<a href="#!/contacts/{{contact._id}}">{{contact.firstName}} {{contact.surname}}</a>',
        scope: { contactId: '=contactId' },
        link: function(scope, element, attrs, ctrl) { }
    };
}]);

contacts.controller('ContactLinkController', [ '$scope', 'Contacts', function($scope, Contacts) {
    $scope.$watch('contactId', function() {
        if ($scope.contactId !== undefined) {
            $scope.contact = Contacts.get({contactId: $scope.contactId});
        } else {
            $scope.contact = undefined;
        }
    });
}]);
