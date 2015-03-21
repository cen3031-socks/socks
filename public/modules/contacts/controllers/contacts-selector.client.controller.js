'use strict';

angular.module('contacts')
    .controller('ContactsSelectorController', ['$stateParams', 'Contacts', '$modal', '$scope', '$rootScope',
        function($stateParams, Contacts, $modal, $scope, $rootScope) {
            $scope.selectedContacts = [];

            $scope.showModal = function() {
                var modalScope = $rootScope.new();
                modalScope.title = $scope.title || 'Find a Contact';
                modalScope.hideUntil = 3;
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
                modalInstance.result.then(function(contact) {
                    // The contact was selected.
					if ($scope.selectedContacts.indexOf(contact) !== -1) {
						$scope.selectedContacts.splice($scope.selectedContacts.indexOf(contact), 1);
					}
					$scope.selectedContacts.push(contact);
                }, function() {
                })
            };

			$scope.unselect = function(contact, index) {
				$scope.selectedContacts.splice(index, 1);
			};
		}]).controller('ContactLinkController', [ '$scope', 'Contacts',
			function($scope, Contacts) {
				$scope.$watch('contactId', function() {
					if ($scope.contactId !== undefined) {
						$scope.contact = Contacts.get({contactId: $scope.contactId});
					} else { 
						$scope.contact = undefined;
					}
				});
		}]).directive('contactsSelector',
        function() {
            return {
                restrict: 'E',
                controller: 'ContactsSelectorController',
                scope: { maxContacts: '=max', selectedContacts: '=?ngModel', title: '=?title', hideUntil: '=?hideUntil' },
                templateUrl: '/modules/contacts/views/contact-selector.client.template.html',
                link: function(scope, element, attrs, ctrl) { }
            };
        }
    ).directive('contactLink', ['Contacts', 
		function(Contacts) {
            return {
                restrict: 'E',
                controller: 'ContactLinkController',

                template: '<a href="#!/contacts/{{contact._id}}">{{contact.firstName}} {{contact.surname}}</a>',
				scope: { contactId: '=contactId' },
                link: function(scope, element, attrs, ctrl) {
					/*console.log(JSON.stringify(scope));*/
				}
            };
		}]
	);

