
angular.module('contacts')
    .controller('ContactsSelectorController', ['$stateParams', 'Contacts', '$modal', '$scope',
        function($stateParams, Contacts, $modal, $scope) {
            $scope.contacts = Contacts.query();
            $scope.selectedContacts = [];

            $scope.showModal = function() {
                var modalInstance = $modal.open({
                    templateUrl: '/modules/contacts/views/select-contact-list.client.template.html',
                    controller: function($scope, $modalInstance, contacts) {
                        $scope.contacts = contacts;
                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                        $scope.select = function(contact) {
                            $modalInstance.close(contact);
                        }
                    },
                    size: 'lg',
                    resolve: {
                        contacts: function() {
                            return $scope.contacts;
                        }
                    }
                });
                modalInstance.result.then(function(contact) {
                    // The contact was selected.
                    alert(contact.firstName);
                }, function() {
                })
            }
    }]).directive('contactsSelector',
        function() {
            return {
                restrict: 'E',
                controller: 'ContactsSelectorController',
                scope: { maxContacts: '=max' },
                templateUrl: '/modules/contacts/views/contact-selector.client.template.html',
                link: function(scope, element, attrs, ctrl) {
                }
            };
        }
    );
